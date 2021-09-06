---
layout: post
title: TECH | Three DDD stories
tags: tech
---

In this article, I will tell you 3 real-life examples where Domain-driven design practices could have helped teams avoid lots of confusions and waste of time and money.

<!--more-->

These stories feature:

- 👔 The Business Guy
- 💻 The Developers
- 🤦 The Facepalm

# 1. Taking words into account

👔 The business guy comes to 💻 the developers to implement yet another great feature described with those words:

> We want to implement the _user account_, so people can sign-in to our website, login or logout. When logged-in they will be able to see all their past orders.

This feature sounds cristal clear to you, after all, _user accounts_ like that have been implemented since decades.

Later that day, 💻 the developers starts [spiking](http://wiki.c2.com/?SpikeSolution) some code when 👔 the business guy comes back in their office:

> Hi! Everything is going fine with the _customer account?_

🤦 ...

Maybe, like 💻 the developers in the story, you are now feeling uncomfortable. What did the guy in a suit just say ? Did he say _customer_ or _user?_

The developers already created a git repository called _user-account_, but this is not the more problematic: a simple confusion like this can give every participant of the discussion lots of trouble.

- What if the business guy did not come back before the next demo ?
- What about future developers ? With half of the code mentioning _user account_ and the another part _customer account_, will they understand what is the truth ?

You might think, it is just a word, _customer account_ or _user account_, it is the same thing right?

In fact, what the business guy was implicitly thinking: the users can only create an account after their first purchase, meaning that they are now customers. By mixing just one word with another, the team created a knowledge gap.

<div class="callout">
    <div class="callout-icon">💡</div>
    <div class="callout-text">
        Building a <strong>Ubiquitous Language</strong> between members of your team is key to tackling complexity. Expect more than few sentences from your domain experts: communicate often and reveal the implicit.
    </div>
</div>

# 2. Poke around with the core concepts

👔 The business guy comes back to 💻 the developers to implement yet another great feature described with those words:

> We want our customers to be able to _poke_ other customers, this feature is super urgent, I want our app to be the top poking app on the web!

Wow, this is exciting! There are too few poking apps on the web, and thinking that your company is going to be a major competitor in this new domain gives everyone goose bumps.

This time around, 💻 the developers are super serious about communicating with 👔 the business guy. They iterate quickly, meet this domain expert every day. The Tech Department invests a lot of new instances of servers to be able to handle the poking charge. Interns are hired, satisfaction rate is high in the team.

After three months of intense programming, documentation writing and deprioritization: you finally have it: **_God! Customers are going to poke hard!_**

The month after, the head of finance comes to 💻 the developers and ask them to explain why they invested so much time and money for a feature with zero benefit.

🤦 ...

The truth is that, this poking app was far from being your company's core domain, you could have bought a monthly licence to the javascript library _[poke.js](https://www.youtube.com/watch?v=dQw4w9WgXcQ)_ instead and save the company tons of money.

<div class="callout">
    <div class="callout-icon">💡</div>
    <div class="callout-text">
        Determine what is important for the company (core domain) and what is not. Follow the <a href="https://www.investopedia.com/terms/m/make-or-buy-decision.asp">Make-or-Buy Decision</a>. Plus, keep a good relationship with the finance and accounting teams, they know more about your core domain that you think, or at least they know what actually brings money or not in the company.
    </div>
</div>

# 3. Divide et impera

👔 The business guy comes to 💻 the developers with great news:

> We are going to split you in multiple feature teams! We heard that it helped Spotify boost their productivity. Divide and conquer, _bitch_!

The teams have been decided by 👔 the business guy and the CTO during lunch time:

- The _frontend_ feature team, responsible of making our customers happy
- The _backend_ feature team, responsible of making our suppliers happy
- The _API_ feature team, responsible of everything between the customers and the suppliers, plus building cool REST APIs.

The company being innovative, two thirds of 💻 the developers will join the _API_ feature team, the rest will be dispatched between the _supply_ and _customer_ teams.

Very soon, half of 💻 the developers will leave the company.

🤦 ...

The problem is that, companies are rarely driven by features or technology:

- 💻 The developers will lack of a proper membership
- Interactions between 💻 the developers will become painful
- Some areas of responsibility will be fuzzy and decisions would take longer
- 💻 The developers will be detached from the company's core domains

<div class="callout">
    <div class="callout-icon">💡</div>
    <div class="callout-text">
        Take the time to explore the different sub-domains and contexts that your company tries to solve. Use strategical patterns and build a context map to discover the most efficient way to split your teams. This should not be done lightly.
    </div>
</div>

# Conclusion

I hope you liked those three domain-driven design stories, if you have other examples where you think domain-driven design could have helped you or your company, please share them!
