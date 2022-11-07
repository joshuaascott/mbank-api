# Drop the current database
npx sequelize-cli db:migrate:undo:all

sleep 1

# Run all the migrations
npx sequelize-cli db:migrate

sleep 1

# Seed the data into database
npx sequelize-cli db:seed:all
