flowchart TB
    FE[Frontend]

    AG[API Gateway<br/>(Stateless)<br/>Redis: Rate Limiting]

    FE --> AG

    AG --> AUTH[Auth Service<br/>Postgres + Redis]
    AG --> USER[User Service<br/>Postgres + Redis]
    AG --> POST[Post Service<br/>Postgres + Redis]
    AG --> COMMENT[Comment Service<br/>Postgres + Redis]

    AUTH --> KAFKA[(Kafka<br/>Shared Cluster)]
    USER --> KAFKA
    POST --> KAFKA
    COMMENT --> KAFKA

    KAFKA --> NOTIFY[Notification Service<br/>Email / SMS / Push]
