APP_NAME ?= sandbox-app
AWS_REGION ?= us-gov-west-1
AWS_PROFILE ?= DeveloperAccountAccess-549388344306
ACCOUNT_ID ?= 549388344306
ECR_REPO ?= sandbox-app
IMAGE_TAG ?= latest
ECR_URL := $(ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(ECR_REPO)

export AWS_PROFILE

.PHONY: docker-build docker-run-local ecr-login ecr-push tf-init tf-plan tf-apply tf-destroy

docker-build:
	docker build -t $(APP_NAME):$(IMAGE_TAG) .

docker-run-local:
	docker run --rm -p 3000:3000 \
	  -e DB_HOST=host.docker.internal \
	  -e DB_PORT=5432 \
	  -e DB_NAME=cvle_sandbox \
	  -e DB_USER=postgres \
	  -e DB_PASSWORD=postgres \
	  -e AWS_REGION=$(AWS_REGION) \
	  -e S3_BUCKET_NAME=rc-cvle-sandbox-bucket-terraform \
	  -e AWS_ACCESS_KEY_ID=YOUR_KEY \
	  -e AWS_SECRET_ACCESS_KEY=YOUR_SECRET \
	  $(APP_NAME):$(IMAGE_TAG)

ecr-login:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com

ecr-push: docker-build
	docker tag $(APP_NAME):$(IMAGE_TAG) $(ECR_URL):$(IMAGE_TAG)
	docker push $(ECR_URL):$(IMAGE_TAG)

tf-init:
	cd infra && terraform init

tf-plan:
	cd infra && terraform plan

tf-apply:
	cd infra && terraform apply

tf-destroy:
	cd infra && terraform destroy
