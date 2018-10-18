cd terraform/resources

# Remove previous state
rm terraform.tfstate

terraform apply -auto-approve -input=false

