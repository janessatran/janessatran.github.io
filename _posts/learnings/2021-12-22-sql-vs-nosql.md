---
date: 2021-12-22
title: 'System Design: SQL vs NoSQL'
---

When deciding what type of database to use for an application system, it's important to know about the strengths and weaknesses of your options. The main two types are SQL (relational database) and NoSQL (non-relational / distributed database).

## SQL

SQL Databases are also known as relational databases. Examples of popular SQL databases include MySQL, PostgreSQL, Microsoft SQL Server, Oracle, CockroachDB. They offer strength in the following areas:

1. **Relationships**: Allows easy querying between data among multiple tables. These relationships are defined using primary and foreign key columns.
2. **Structured Data**: The data is structured using SQL schemas which define the columns and tables in the DB. Because the model / format of the data must be known before storing anything, it reduces room for error in saving data.
3. **ACID compliant**: Atomicity, Consistency, Isolation, Durability. SQL transactions are executed atomically, meaning they are either all excuted or not executed at all if any statement in the group fails. An example of the importance of this feature is demonstrated in the scenario where a user is looking to transfer money from their bank, but lack sufficient funds. Instead of the withdrawal executing, the entire transaction would just fail.

```SQL
BEGIN TRANSACTION t1;
UPDATE balances SET balance = balance - 100 WHERE account_id = 1;
UPDATE balances SET balance = balance + 25 WHERE account_id = 2;
COMMIT TRANSACTION
```

On the other hand, SQL Databases present weaknesses in the following ways:

1. **Structured Data**: Columns and tables have to be set up ahead of time, so these databases take more time to set up compared to NoSQL. They are also not as good at storing/querying unstructured data.
2. **Scaling is difficult**: Horizontal scaling is difficult, so if a system is write-heavy the only option is often to vertically scale the database up which is more expensive in general than provisioning additional servers. For read-heavy systems, you can provision multiple read-only replicas of the DB.

## NoSQL

NoSQL stands for "Not only SQL" and emerged with big data and web/mobile applications. It is rooted in graph, document, key-value pairs and wide-column stores. Examples of popular NoSQL databases include MongoDB, Redis, DynamoDB, Cassandra, CouchDB. The advantages this type of database offers includes:

1. **Unstructured Data**: It does not support table relationships, but instead stores data in documents or key-value pairs. This makes the database more flexible and easier to set up, particularly when storing unstructured data.
2. **Horizontal Scaling**: NoSQL databases can be divded across different data stores, allowing for distributed databases, since it lacks relationships. This makes it easier to scale the DB for large amounts of data without having to purchase a single, expensive sever. They support both read-heavy and write-heavy systems.

The weaknesses for this type of database include:

1. **Eventual Consistency**: Because these databases are usually designed for distributed use cases, after writing to one shard in a distributed NoSQL cluster, there is a small delay before the change is propagated to other replicas. During this time, reading from a replica can yield inaccurate information. Note, this isn't necessarily a weakness of NoSQL databases but rather distributed databases in general.

## SQL vs NoSQL Scenarios

**_Amazon Targeted Ads_**: Let's say you are building a targeted product advertisement engine that is personalized for customers. What kind of database should be used?

**NoSQL.** There are a few considerations to make. One, this service needs to be built for Amazon's tens of millions of customers so horizontal scaling is important. It's also probably fine that that the data is a little out of date but eventually consistency since it's just recommendations.

---

**_Banks Loans_**: We want to build a service at our bank to allow users to apply for loans through our application. The database will store loan applications which includes information about the loan amount, user's current balance, and user's prior transaction history. What kind of database should be used?

**SQL.** In financial applications, data consistency is very important. Also, there are many relational tables in this scenario including tables for User, Loan, and Transaction.

---

**_Website Session Store_**: You want to create a session store to manage session information for each user who might visit a website. What type of database should be used?

**NoSQL.** Information about a user's session is unstructured in nature since each user's session differs. It's easier to store this type of information in a schema-less document. Moreover, low-latency access to session data is important for a good user experience.

---

**_Health Care Company Info_**: We want a database to maintain information about the different offices for health care provider company. The offices are in different states and have many doctors who work with multiple patients. What type of database should be used?

**SQL.** There are many relations in the schema that are apparent: An Office has many Doctors, a Doctor has many Patients, and a Patient has many health records.
