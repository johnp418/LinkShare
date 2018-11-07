# resource "aws_lambda_function" "main" {
#   filename      = "lambda.zip"
#   function_name = "terraform-example"
#   role          = "${aws_iam_role.main.arn}"
#   handler       = "exports.example"
#   runtime       = "nodejs4.3"
# }
# resource "aws_iam_role" "main" {
#   name = "terraform-example-lambda"
#   assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Action": "sts:AssumeRole",
#       "Principal": {
#         "Service": "lambda.amazonaws.com"
#       },
#       "Effect": "Allow",
#       "Sid": ""
#     }
#   ]
# }
# EOF
# }
# resource "aws_iam_role" "cidp" {
#   name = "terraform-example-cognito-idp"
#   path = "/service-role/"
#   assume_role_policy = <<POLICY
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Sid": "",
#       "Effect": "Allow",
#       "Principal": {
#         "Service": "cognito-idp.amazonaws.com"
#       },
#       "Action": "sts:AssumeRole",
#       "Condition": {
#         "StringEquals": {
#           "sts:ExternalId": "12345"
#         }
#       }
#     }
#   ]
# }
# POLICY
# }
# resource "aws_iam_role_policy" "main" {
#   name = "terraform-example-cognito-idp"
#   role = "${aws_iam_role.cidp.id}"
#   policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Action": [
#         "sns:publish"
#       ],
#       "Resource": [
#         "*"
#       ]
#     }
#   ]
# }
# EOF
# }

