yum update -y
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 14.16.1
node -e "console.log('Running Node.js ' + process.version)"
yum install docker -y
service docker start
usermod -a -G docker ec2-user