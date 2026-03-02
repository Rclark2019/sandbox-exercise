# GovCloud Deployment (Terraform + ECS)

This folder contains Terraform configuration to deploy the sandbox app to AWS GovCloud (ECS Fargate + ALB + RDS + S3 + ECR).

## Prerequisites
- AWS GovCloud account credentials (via `aws configure` or env vars)
- Docker installed
- Terraform v1.5+ installed
- An S3 bucket name that is globally unique

## Local Container Test
Use your existing local Postgres and an S3 bucket/credentials.

1. Start local Postgres (from repo root):
```bash
cd db
export DB_USER=sandbox
export DB_PASSWORD=devpassword
export DB_NAME=sandbox
export DB_PORT=5432
docker compose up -d
```

2. Build and run the container:
```bash
docker build -t sandbox-app:local .

docker run --rm -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=sandbox \
  -e DB_USER=sandbox \
  -e DB_PASSWORD=devpassword \
  -e AWS_REGION=us-gov-west-1 \
  -e S3_BUCKET_NAME=your-s3-bucket \
  -e AWS_ACCESS_KEY_ID=YOUR_KEY \
  -e AWS_SECRET_ACCESS_KEY=YOUR_SECRET \
  sandbox-app:local
```

App should be available at `http://localhost:3000`.

## Terraform Usage
From `infra/`:

1. Create a tfvars file:
```bash
cp terraform.tfvars.example terraform.tfvars
```
Edit `terraform.tfvars` with your real values.

2. Initialize and apply:
```bash
terraform init
terraform plan
terraform apply
```

3. Get the ALB URL:
```bash
terraform output alb_dns_name
```

## ECR Commands
Replace placeholders with your account and region:
If you prefer Make targets, see the repo `Makefile` for `ecr-login` and `ecr-push`.

1. Authenticate Docker to ECR:
```bash
aws ecr get-login-password --region us-gov-west-1 \
  | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-gov-west-1.amazonaws.com
```

2. Build, tag, and push:
```bash
docker build -t sandbox-app:latest ..

docker tag sandbox-app:latest <ACCOUNT_ID>.dkr.ecr.us-gov-west-1.amazonaws.com/sandbox-app:latest

docker push <ACCOUNT_ID>.dkr.ecr.us-gov-west-1.amazonaws.com/sandbox-app:latest
```

## Deploy Updates
After pushing a new image tag:
```bash
terraform apply
```
If you reused the same tag (e.g. `latest`), force a new deployment:
```bash
aws ecs update-service \
  --cluster <PROJECT>-cluster \
  --service <PROJECT>-service \
  --force-new-deployment
```

## Database Schema
The backend automatically creates the `text_entries` table on startup. If you prefer running the script manually, use `db/init.sql` from a host that can reach the private RDS instance (e.g. a temporary EC2 instance in the VPC).

## Teardown
```bash
terraform destroy
```

## Manual Steps
- Create `terraform.tfvars` with real values
- Authenticate Docker to ECR
- Push the container image before the first `terraform apply`
 - Update `ACCOUNT_ID` in `Makefile` if you plan to use Make targets
