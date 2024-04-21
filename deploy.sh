# shellcheck disable=SC2164
echo "Deploying tierlistmaker to Firebase"
cd tierlistmaker-frontend
npm run build
cd ..
cd tierlistmaker-backend/functions
npm run build:full
firebase deploy
echo "Successfully deployed tierlistmaker to Firebase"


