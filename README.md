# Microservices Node.js – Rocketseat Event

This project demonstrates a microservices architecture using Node.js, TypeScript, Fastify, PostgreSQL, RabbitMQ, and Pulumi for AWS infrastructure provisioning. It was created as part of a Rocketseat Event.

## Project Structure

```
.
├── app-orders/      # Orders microservice (Fastify, PostgreSQL, RabbitMQ)
├── app-invoices/    # Invoices microservice (Fastify, PostgreSQL, RabbitMQ)
├── contracts/       # Shared TypeScript contracts/messages
├── docker/          # Docker configs (e.g., Kong API Gateway)
├── infra/           # Pulumi IaC for AWS (ECR, ECS, etc.)
├── docker-compose.yml  # Local dev stack (RabbitMQ, Jaeger, Kong)
```

## Features

- **Microservices**: Isolated services for orders and invoices, each with its own database.
- **API Gateway**: Kong for routing and CORS.
- **Message Broker**: RabbitMQ for event-driven communication.
- **Database**: PostgreSQL with Drizzle ORM and migrations.
- **Tracing**: OpenTelemetry and Jaeger for distributed tracing.
- **Infrastructure as Code**: Pulumi for AWS (ECR, ECS Fargate, etc.).
- **Type Safety**: Shared TypeScript contracts for message validation.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Docker](https://www.docker.com/)
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- AWS credentials configured (`aws configure`)

### Local Development

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd microservices-nodejs
   ```

2. **Start infrastructure (RabbitMQ, Jaeger, Kong)**

   ```sh
   docker-compose up
   ```

3. **Start databases for each service**

   In separate terminals:

   ```sh
   cd app-orders
   docker-compose up
   ```

   ```sh
   cd app-invoices
   docker-compose up
   ```

4. **Install dependencies and run services**

   For each service:

   ```sh
   cd app-orders
   npm install
   npm run dev
   ```

   ```sh
   cd app-invoices
   npm install
   npm run dev
   ```

5. **Access Kong API Gateway**

   - Orders: `http://localhost:8000/orders`
   - Invoices: `http://localhost:8000/invoices`
   - Kong Admin: `http://localhost:8002`
   - RabbitMQ: `http://localhost:15672` (user/pass: guest/guest)
   - Jaeger: `http://localhost:16686`

### Deploying to AWS

1. **Configure Pulumi stack**

   ```sh
   cd infra
   npm install
   pulumi stack select dev
   pulumi config set aws:region us-east-1
   ```

2. **Deploy**

   ```sh
   pulumi up
   ```

   This will provision ECR, build and push Docker images, and deploy to ECS Fargate.

## Contracts

Shared message contracts are in [`contracts/messages/`](contracts/messages/).

## Useful Commands

- Run migrations:  
  ```sh
  npm run drizzle:migrate
  ```
- View traces:  
  Open [Jaeger UI](http://localhost:16686)

## Credits

Created during a [Rocketseat](https://rocketseat.com.br/) event.

---

Feel free to contribute or open issues!