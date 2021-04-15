---
layout: post
title: TECH | Stop using JPA/Hibernate
tags: tech
image: /assets/images/posts/jpa_hibernates/troll.JPG
---

---

EDIT 1: I replaced most of the pronouns "he" by "they" to make the article more inclusive

EDIT 2: I improved the article, thanks to your awesome feedbacks, thank you very much

## Introduction 🐈

---

15 years of that, during my master, a teacher taught us a new technology, allowing, I quote:

_You will not have to write SQL queries anymore! If you are like me, and you hate writing SQL queries you are going to love this framework!_


This is how, for the first time, a framework that was growing in popularity was sold to me.

No more complexity of writing SQL queries, we replaced a scripting language with object-oriented programming.

JPA and its best-known Hibernate implementation are thus among the most widely used technologies in the JAVA ecosystem today. Thousands of projects exist on GitHub using them.

Although so many projects use these technologies, in this article I will try to convince you to stop using them in your next projects.

Before I jump into my take about JPA and Hibern-HATE, let me talk about documentation.

---

## Documentation and complexity 🐱

---

<img class="rounded-full transition duration-900 ease-in-out transform hover:-rotate-6 object-cover w-128 h-128 mx-auto"
src="/assets/images/posts/jpa_hibernates/study_doc.png" alt="A cat reading documentation">

It seems undeniable to me that many who read this article will be able to offer solutions or even counterarguments to some of my reasons for hating JPA / Hibernate.

I would of course be happy to hear them.

However, I would like us to dwell on the official 3.6 Hibernate <a href="https://docs.jboss.org/hibernate/orm/3.6/reference/en-US/pdf/hibernate_reference.pdf" target="_blank">documentation</a>.

This document is 406 pages long. This is not the most recent version, but one of the latest version still offering the full PDF to download.

To compare:

* _The Lord of The Rings: The Fellowship of the Ring_ is 231 pages long (in the same PDF format as Hibernate)
* Version 2 of the _Data Management: Structured Query Language (SQL)_ specification is 288 pages long

The first and most important argument I could have against JPA / Hibernate is this: I don't want to have to pass a master to perform database queries.

---

## Mutability 😹

---

<img class="rounded-full transition duration-900 ease-in-out transform hover:-rotate-6 object-cover w-128 h-128 mx-auto"
src="/assets/images/posts/jpa_hibernates/mutability.png" alt="A cat with multiple faces">

### Default empty constructor must be present

Invariant means something that does not change or vary. In Object Oriented Design, a common practice, is to couple the object invariants with its life cycle.

An `Order` cannot be placed without an `Item`? Therefore, an `Order` should NOT be created if an `Item` is not provided.

A simple example of the implementation of an invariant would be:

```java
    public class Order {
        private final String id;
        private final Set<Item> items;
  
        public Order(final String uuid, final Set<Item> items) throws AtLeastOneItemShouldBeProvided {
            this.id = uuid;
            if(items == null || items.isEmpty()) throw new AtLeastOneItemShouldBeProvided();
        }
  
        public static class AtLeastOneItemShouldBeProvided extends Exception {}
    }
```

In this example, Order without an item, CANNOT be instantiated. And a domain exception is thrown at you.

Hibernate, on the other end, *REQUIRES* you to write a default constructor, meaning that an Order object can be instantiated with no `Item` and in this example, even without an id!

### Entity classes cannot be final

A practice I learned to follow is to make a class either final or abstract, this allows multiple things:

* favor composition instead of inheritance whenever possible
* avoid breaking the Liskov principle

This practice might have downsides it is really sad having a framework relying on proxies to construct entities preventing us to do that.

### Reflection (or Introspection)

* Reflection is anti-OOP
* An object is not a data structure with methods
* Introspection is a workaround for bad design

Let's say that we are starting a new company called 'Encapsulation', building secured doors for apartments.

These special kind of doors has two main features:

* do not let people from the outside know what is inside your apartment
* do not let people from the outside enter your house without your consent

Would you be interested in a new feature called 'Reflection' allowing to bypass this security?

This is what 'Reflection' is, a superpower allowing your application to open doors, or access content.

Numerous security breaches have been discovered in frameworks using 'Reflection' because it allows unwanted people to enter your house.

### Impossible to return a copy or unmodifiable collection in accessors

Ok, so now we are forced to implement getter and setters, so at least let's try and protect our data from being modified by the clients:

```java
    public class Order {
        // removed for clarity
        private final Set<Item> items;
  
        public Order(final String uuid, final Set<Item> items) {
            // removed for clarity
        }
  
        public Set<Item> getItems() {
            this.orderStatus = Collections.unmodifiableSet(items);
        }
        // removed for clarity
    }
```

Hum... but this will work only if you use `field access` with hibernate, if you don't, another developer can easily do:

```java
    public class Client {
        public void myEvilMethod(final Order order) {
            order.getItems().clear();
        }
    }
```

I let you read the <a href="https://hibernate.org/orm/documentation" target="_blank">documentation</a> for further information about that.



In the meanwhile, let's talk about lazy loading.

---

## LAZY LOADING and CACHE 😿

---

<img class="rounded-full transition duration-900 ease-in-out transform hover:-rotate-6 object-cover w-128 h-128 mx-auto"
src="/assets/images/posts/jpa_hibernates/lazy.png" alt="A sleeping cat">

### Laziness

I will not deep-dive too much about this one, LAZY LOADING mechanism in Hibernate is a nightmare for newcomers.

If you end-up using the @Lazy annotation, it simply means one thing: the design of your entities is wrong.

This is as simple as that, but there are two possibilities here:

* you followed the design of your domain, but unfortunately they are not compatible with Hibernate, so you had to add those mappings
* you wanted to write queries, but could not, so you had to add those mappings

This is most frustrating point about this framework, you are doomed to adapt your domain model to fit for some simple needs.

### Cache

Nobody understands the cache mechanism, you end up de-activating it. Worse, those understanding it are not caching query responses, they are caching entities.

---

## Flush 😾

---

<img class="rounded-full transition duration-900 ease-in-out transform hover:-rotate-6 object-cover w-128 h-128 mx-auto"
src="/assets/images/posts/jpa_hibernates/schrodinger_cat.png" alt="Schrodinger's cat">

_Schrodinger's cat dies each time hibernate performs a flush(), is it dead or alive?_

`flush()` synchronizes your database with the current state of object/objects held in the memory, by default, flush is performed automatically
and can occur between the moment you save an entity to the moment the transaction is committed.

This leads us to two pitfalls:

* this makes developers unable to use another persistent tool than Hibernate, because writes are done in memory until they are flushed
* this leads to horrible and untraceable stack traces when conflicts emerge during a flush, those stack traces are indeed never related to your code

---

## Accessing a single table field 😻

---

<img class="rounded-full transition duration-900 ease-in-out transform hover:-rotate-6 object-cover w-128 h-128 mx-auto"
src="/assets/images/posts/jpa_hibernates/single_cat.png" alt="A single cat">

One good practice regarding API's customer, described in this [article](https://martinfowler.com/bliki/TolerantReader.html) is the notion of Tolerant Reader.

Let me quote Martin Fowler on that:

| My recommendation is to be as tolerant as possible when reading data from a service. If you're consuming an XML file, then only take the elements you need, ignore anything you don't. Furthermore, make the minimum assumptions about the structure of the XML you're consuming.

I agree, this recommendation leads to minimizing coupling between a customer and a provider.

What I would argue here, is that a database IS an API. Because it has its own lifecycle, a database can evolve independently of the client versions using it.

Imagine that you need the url of an image stored in the database, what is the difference between:

```sql
select url from image 
where id = 'F462E8D9-9DF7-4A58-9112-EDE0434B4ACE';
```

and

```sql
select id, url, content_type, digest from image 
where id = 'F462E8D9-9DF7-4A58-9112-EDE0434B4ACE';
```

?

The first query only consumes the needed table fields `url` and `id`.

The second consumes all the fields from the table, which is comparable to run a `select * from ...`.

I argue that we should favor the first option: if we had to rename one other column, we would not break this simple feature.

But what about hibernate?

If you want to do that you have to use complicated projections.

If instead, you fetch the JPA entity representing Image, it will fetch all the columns the same way as the second query.

---

## Constraints 😸

---

<img class="rounded-full transition duration-900 ease-in-out transform hover:-rotate-6 object-cover w-128 h-128 mx-auto"
src="/assets/images/posts/jpa_hibernates/hacker.png" alt="A hacker cat">

```java
public class User {
    // removed for clarity
  
    @NotNull
    @NotEmpty
    @Email
    private String email;

    // removed for clarity
}
```

This is the worst. Honestly, never use those annotations. In this example, we are introducing business rules using javax validation annotations.

This is wrong for multiple reasons:

* you cannot unit-test your conditions
* they are checked too late in the process (during the flush)
* the exceptions which are thrown are generic, though unusable
* they treat business rules as if they were technical rules

---

## Strategic level pitfalls 😽

---

### Hibernate and Spring are frameworks

It is time to be honest here, Frameworks are great, but they are evil.

* Framework updates are horrible
* Frameworks do not keep retro-compatibility
* They WANT you to keep using them

I love open source, really, but big companies sponsoring open-source projects get most of their income from support or third party tools.

They NEED to monopolise the market, and one way to do that, is to make you believe that it is mandatory to use their frameworks.

* How many developers refuse to work in companies because they are not using a certain framework?
* How many companies refuse to hire developers because they do NOT know a certain framework?

This loop has to stop, what defines the value of the projects we are working on has nothing to do with technologies and frameworks.

I WANT to solve business problems, I do not want to keep solving technical issues.

### To go fast is to go wrong

| But _type any framework here_ is great to develop a quick proof of concept.

No, this is wrong.

* A proof-of-concept aims to see if we can solve a business problem: it does not only validate technical feasibility
* Using _type any framework here_ just in the Proof-of-concept is a non-sense, you will have to re-do everything in the end
* We should bear in mind that "throwing a proof of concept in the garbage" is never an option
 * You learned things during the POC that you will never unlearn
 * You will end-up re-using what you learned anyway
 * In particular, if you used JPA/Hibernate in the POC, you biased your perception of the domain models

The premature architecture decisions we make are WRONG. Whenever this is possible, a POC should be started without persistence and minimal interfaces.

---

## What is wrong with SQL? 🙉

---

* Known by everyone (hopefully as well by those who use JPA/Hibernate)
* When developers write vanilla SQL:
  * They know what is being done
  * They can check missing indexes by doing an explain on the query
  * They can cache data by query
  * They do not require framework update of SQL

Let's stop using JPA/Hibernate in our projects when simple vanilla SQL can do the work.

---

## But my manager forces me to use Hibernate on my new project 🙈

---

Ok, that sucks. Quit your job...

... or try this:

* Implement anything JPA/hibernate related outside your domain package or module.
* Hide those nasty JPA DAOs and hibernate entities in the infrastructure layer
* Make your domain layer as framework-free as possible

You can use inversion of control for that, just keep in mind that the task will not be easy, that you will write a lot of mappers to navigate between your domain models and your database related JPA entities. But at least, you will simplify the job for the next developers to get rid of it.

I mean... when your manager will be gone.

---

## But my project is already well started with JPA/Hibernate in the domain 🙈

---

Well... that sucks even more. I will try to give some piece of advice about that.

### Stop having public default constructor and setters

Here an example of a JPA entity (using Lombok for simplicity):

```java
@Entity
@Table("offer")
@EqualsAndHashcode
@NoArgsConstructor // for Hibernate
@Setter // for Hibernate
@Getter
public class BankAccount {
    @Id
    @Column("id")
    private String id;

    @Column("opened")
    private boolean opened;

    @OneToMany(fetch = LAZY) // ...simplified
    private Set<Long> ownerIds;
}
```

In this entity, the default constructor, setters and getters are public.

Now let's take a look at the service, creating a bank account:

```java
public class BankAccountService {
    private BankAccountJPARepository bankAccountJPARepository;

    public void createBankAccount(final Set<Long> ownerIds) {
        final BankAccount bankAccount = new BankAccount();
        bankAccount.setId(UUID.randomUUID().toString());
        bankAccount.setOpened(true);

        if(ownerIds == null || ownerIds.isEmpty()) {
            throw new IllegalStateException();
        }

        bankAccount.setOwnerIds(ownerIds);

        this.bankAccountJPARepository.saveAndFlush(bankAccount);
    }
}
```

With these two classes, there are multiple problems:
* the entity `BankAccount` is anemic, it only contains only data and connections to other entities
* a result of that is that the service instantiating require to call a series of setter with the risk than a developer forgets to set something
* one condition checking that a bank account should not exist with have an owner specified is outside of the entity itself

I think we can do better, keeping in mind that Hibernate requires default constructor and setters:


```java
@Entity
@Table("bank_account")
@EqualsAndHashcode
@NoArgsConstructor(access = PACKAGE) // for Hibernate only, please do not use
@Setter(value = PACKAGE) // for Hibernate, please do not use
@Getter
public class BankAccount {
    @Id
    @Column("id")
    private String id;

    @Column("opened")
    private boolean opened;

    @OneToMany(fetch = LAZY) // ...simplified
    private Set<Long> ownerIds;

    public BankAccount(final String id, final Collection<Long> ownerIds) {
        if(ownerIds == null || ownerIds.isEmpty()) {
            throw new AtLeastOneOwnerIsRequired();
        }
        this.id = validateNotBlank(id);
        this.ownerIds = new HashSet(ownerIds);
        this.opened = true;
    }
}
```

There are multiple things to see in the new implementation:
* the default constructor and setters now have package visibility
* the only public constructor now accepts two parameters: id and a collection of ownerIds
* the type for ownerIds is not required to be a Set
* the condition checking ownerIds is BankAccount's responsibility, this is now an invariant
* the flag `opened` is marked as true in the constructor, ensuring it is not forgotten
* the previous runtime exception `IllegalStateException` has been replaced by a checked Exception with a meaningful name
* the exception list its suffix Exception, as the sentence `AtLeastOneOwnerIsRequired` suffices to mean that something wrong happened


The service class will now look like:

```java
public class BankAccountService {
    private BankAccountJPARepository bankAccountJPARepository;

    public void createBankAccount(final Set<Long> ownerIds) throws AtLeastOneOwnerIsRequired {
        final BankAccount bankAccount = new BankAccount(UUID.randomUUID().toString(), ownerIds);
        this.bankAccountJPARepository.saveAndFlush(bankAccount);
    }
}
```

### Stop using SQL generated id

Whenever possible, you should align-up your entities "functional keys" with the business concept of identity.

A `User` can be considered unique in one context by its *email address*, or by its *social security number* (note: it does not mean that the primary key should be one of them, but the domain model entity should have a clear identity).

Anyway, because your domain model would be bound to your database model with hibernate, think it as a good opportunity for your new entity to own a business identifier instead of a technical auto-generated id.

If this is impossible (for example, a *bank account* does not have a functional identifier), prefer using string type (for example, an UUID) instead of numerical IDs.

It is easier to adapt and migrate string than numerical values, plus, having incremental IDs, expose you to having those leaked through the interface, in URLs, and it would allow _hackers_ to guess them.

### Rename your JPA Repositories to JPA DAOs

I really dislike the fact that spring decided to call the interfaces responsible to manage the collection of data model objects `XXXRepositories`. IMHO, naming them `XXXDao` emphasizes the fact that they belong to the infrastructure.

### Do not let Hibernate generate IDs

Do not use `@SequenceGenerator` in your `@Id` primary key. Instead, use an explicit service generating them.

With spring-data-jpa, for example:

```java
public interface XXXDao extends CrudRepository {
    @Query(value = "SELECT nextval('xxxx_sequence')", nativeQuery = true)
    BigInteger generateNewId();
}
```

This for multiple reasons:

* if an id is generated, it should be done knowingly
* you will be able to change the implementation later without changing the entity
* you will be able to test this generation

To summarize, you should have control to your IDs, if one day you want to change them it will be easier.

### Keep JPA DAOs outside of the domain as much as you can

You still have a big coupling between your "domain" entities and JPA annotations. Sorry, but it will not change easily.

But what you could do, it to mitigate the coupling between your domain layer and spring data.

Once again, JPA DAOs are *not* domain repositories. You should have an intermediate layer between the domain services and the JPA DAOs.

Let's go back to our `BankAccountService` to try and improve it:

```java
public class BankAccountService {
    private BankAccountJPARepository bankAccountJPARepository;

    public void createBankAccount(final Set<Long> ownerIds) throws AtLeastOneOwnerIsRequired {
        final BankAccount bankAccount = new BankAccount(UUID.randomUUID().toString(), ownerIds);
        this.bankAccountJPARepository.saveAndFlush(bankAccount);
    }
}
```

Let's build an interface in our domain layer which will be our domain repository:

```java
public interface BankAccounts {
    void save(BankAccount bankAccount);
}
```

and use it:

```java
public class BankAccountService {
    private BankAccounts bankAccounts;

    public void createBankAccount(final Set<Long> ownerIds) throws AtLeastOneOwnerIsRequired {
        final BankAccount bankAccount = new BankAccount(UUID.randomUUID().toString(), ownerIds);
        this.bankAccounts.save(bankAccount);
    }
}
```

You already note two things:
* There is no mention of `Repository`, here we have the plural form of the entity we want to save, because the domain expert does not know what a `Repository` is. For example, for an entity `Customer`, the plural could be `Market` or `Customers`, let the domain decide.
* The strange method name `saveAndFlush` is replaced by a less technical `save` method

Now that we have introduced a new interface, we create an instance of it! This class can be located in your infrastructure layer, far from the domain models:

```java
public class BankAccountsJPAImpl implements BankAccounts {
    private BankAccountJPARepository bankAccountJPARepository;

    public void save(BankAccount bankAccount) {
        this.bankAccountJPARepository.saveAndFlush(bankAccount);
    }
}
```

This class `BankAccountsJPAImpl` can be injected to your service `BankAccountService` via the constructor.

If one day you need to update spring-data-jpa and the upgrade breaks your code, you will not need to touch your domain layer.

### Stop adding multi-directional association

Let's say now that we introduce the concept of transactions to our `BankAccount`:

```java
@Entity
@Table("bank_account")
// ...removed for clarity
public class BankAccount {
    // ...removed for clarity

    @OneToMany(fetch = LAZY) // ...simplified
    private List<Transaction> transactions;

}
```

the `Transaction` entity being:

```java
@Entity
@Table("bank_account_transaction")
// ...removed for clarity
public class Transaction {
    // ...removed for clarity
}
```

It would be tempting to add the many-to-one relationship to `Transaction`, giving us access to its `BankAccount`, right?
We would have the possibility to navigate easily between `BankAccount` objects to their `Transactions` back and forth.

My take is that this should be forbidden.

The association in your JPA entities should be the logical WRITE association of your aggregate.

Meaning that, if the association is useless when your intention is to represent the intention of an actor, it means it should be avoided.

A `BankAccount` owns a bunch of `Transaction`s. `Transaction` is NOT linked to a `BankAccount`.

### Stop adding entity mappings whenever its possible

In my example, you could note that `BankAccount` is not mapped to `Owner`, it only has its IDs.

Why?

The answer is simple, the only invariant (or business rule) that I have between a `BankAccount` and `Owner` is that there should be at least one. In other words, the mapping with `Owner` is useless.

I would even say that this mapping could be dangerous.

See, I could argue that the concept of `Owner`, even if it has a meaning in my code base, does not belong to the `banking` context, maybe it belongs to the `sales` context.

Having an unnecessary relationship between these two classes would arguably bound two contexts which have nothing to do together.

What if I needed to split my databases in two? In order to scale the `sales` application? Or change the persistence layer underneath? My mapping `BankAccount` <-> `Owner` would need to break.

If you do not need more than an `id`, do not create a mapping.

---

## Conclusion

---

Don't make the same mistake again, next time, drop it:

* You'll have less documentation to read and more time to worry about business related problems
* Do not take early architectural decisions, you do not need JPA/Hibernate
* Have mercy on the next developers, the code you write today is another developer's nightmare tomorrow

