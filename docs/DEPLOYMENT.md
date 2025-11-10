# AWS Amplify Deployment Setup

This project uses GitHub Actions to automatically deploy to AWS Amplify via CloudFormation.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **GitHub Repository** with the code
3. **GitHub Personal Access Token** with `repo` permissions

## Setup Instructions

### 1. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Amplify Deployment"
4. Select scopes: `repo` (full control of private repositories)
5. Generate and copy the token

### 2. Configure AWS IAM Role for GitHub Actions (OIDC)

Create an IAM role that GitHub Actions can assume:

```bash
# Create trust policy for GitHub OIDC
cat > github-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:GdayRui/music-sight-reading:*"
        }
      }
    }
  ]
}
EOF

# Create the OIDC provider (only needed once per AWS account)
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# Create IAM role
aws iam create-role \
  --role-name GitHubActionsAmplifyDeploy \
  --assume-role-policy-document file://github-trust-policy.json

# Attach permissions
aws iam attach-role-policy \
  --role-name GitHubActionsAmplifyDeploy \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

### 3. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `AWS_ROLE_ARN`: The ARN of the IAM role created above (e.g., `arn:aws:iam::123456789012:role/GitHubActionsAmplifyDeploy`)
- `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
- `GH_TOKEN_AMPLIFY`: The GitHub personal access token created in step 1

### 4. Deploy

The workflow will automatically deploy when you push to the `main` branch. You can also manually trigger it:

1. Go to Actions tab in GitHub
2. Select "Deploy to AWS Amplify" workflow
3. Click "Run workflow"

### 5. Access Your Application

After successful deployment, the workflow will output the Amplify App URL. You can also find it in the AWS Amplify console or CloudFormation outputs:

```bash
aws cloudformation describe-stacks \
  --stack-name sight-reading-amplify \
  --query 'Stacks[0].Outputs'
```

## Manual Deployment

If you prefer to deploy manually:

```bash
# Deploy the CloudFormation stack
aws cloudformation deploy \
  --template-file cloudformation/amplify-app.yml \
  --stack-name sight-reading-amplify \
  --parameter-overrides \
    GitHubToken=YOUR_GITHUB_TOKEN \
    Repository=GdayRui/music-sight-reading \
    Branch=main \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

## Cleanup

To delete all resources:

```bash
aws cloudformation delete-stack --stack-name sight-reading-amplify
```

## Troubleshooting

### Build Fails

Check the Amplify build logs in AWS Console → Amplify → Your App → Build history

### OIDC Provider Already Exists

If you get an error that the OIDC provider already exists, skip that step - it only needs to be created once per AWS account.

### Permission Denied

Ensure your IAM role has the necessary permissions and the trust relationship is correctly configured for your repository.
