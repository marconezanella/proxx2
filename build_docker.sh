#config
# chmod a+x ./release.sh
# ./release.sh


# set -ex
# SET THE FOLLOWING VARIABLES

# docker hub username
USERNAME=edipaulo
# image name
IMAGE=proxy-1mk

{ # try
	version=`cat VERSION`
	nova=${version#0}
} || { # catch
    echo 1 > VERSION
}

novavercao=$(( ${nova#0} +1))

# nomeVersao = "$USERNAME/$IMAGE:v$novavercao
echo "version: $version  = nova $novavercao "

echo $novavercao > VERSION

# Buil docker
echo docker build -t $USERNAME/$IMAGE:ve$novavercao .

docker build -t $USERNAME/$IMAGE:ve$novavercao .
docker tag $USERNAME/$IMAGE:ve$novavercao $USERNAME/$IMAGE


# push it
docker push $USERNAME/$IMAGE:latest
docker push $USERNAME/$IMAGE:ve$novavercao
# docker push $USERNAME/$IMAGE:v$novavercao

# autalizar
echo "--  "
echo "kubectl set image deployments/$IMAGE $IMAGE=$USERNAME/$IMAGE:v$novavercao"
echo "kubectl set image deployments/$IMAGE $IMAGE=$USERNAME/$IMAGE:v$novavercao --namespace devel"
echo "--  "

# tag it
git add .
git commit  -m "nova versão docker v$novavercao para v$novavercao"
git push origin
