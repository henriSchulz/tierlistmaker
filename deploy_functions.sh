# shellcheck disable=SC2164
cd tierlistmaker-backend/functions
npm run build:full
firebase deploy --only functions
echo "Successfully deployed tierlistmaker-backend to Firebase"
