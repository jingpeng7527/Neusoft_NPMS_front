# Neusoft_NPMS_front

> [!NOTE]
> This is the front-end code for NPMS by Vue.js

- Our project uses MySQL database, based on distributed microservices development architecture, front-end discover service through gateway, by oauth2 for permission verification. 
- The front-end and back-end are separated, and the back-end is separated from the controller, service and mapper layers. 
- Data is design to VO and PO.

## We divide the system into the following 7 functional modules. 
1. **Customer management module**, in addition to the basic operation of adding, modifying, deleting and updating customers, the relationship between customers and clients can be added, such as A is the parent company of B. The customer can be handed over to A account manager to B account manager.

2. **Opportunity management module**, in addition to adding, modifying, deleting and updating the opportunity, the vice president of marketing, sales director and other people need to approve the opportunity. Client manager's modification of opportunity information may also trigger approval 
3. **Sales log management**, client manager to record sales daily, user can add, modify, delete operations 
4. **Opportunity tracking record module**, the progress of the opportunity, multi-party talks and other information to track 
5. **Nacos registration center**, used to register all the micro services started 
6. **Oauth2 permission management center**, Assign a token to the logged-in user, the front-end carries the token to request the interface, and the back-end verifies the token to determine whether the user has permission to call the interface.
7. **Gateway service**, all the front-end interfaces access the same interface through the gateway, and the gateway forwards requests for the actual service.
