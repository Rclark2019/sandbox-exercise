output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.app.dns_name
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = aws_ecr_repository.app.repository_url
}

output "rds_endpoint" {
  description = "RDS endpoint address"
  value       = aws_db_instance.app.address
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.app.bucket
}
