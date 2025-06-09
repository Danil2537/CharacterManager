# Character Manager

This is a wep-app project for creating and using D&D 5e (2024) characters
Made by Danilo Diedov and Maxim Gorlov as a university coursework.

You can check the app itself on: https://dndcharactermanager.netlify.app/

For running the app on localhost, you must:
Make sure you have git, pnpm, next.js and node.js installed.
In you IDE (preferably VS Code):
– go to the folder where the project should be located;
– run the command git clone  https://github.com/Danil2537/CharacterManager.git;
– add a .env file to the root folder of the project, which will contain the
environment variables DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY; (you can write me a message to get those)
– run command pnpm install to load the application's dependencies;
– run command pnpm build to compile the application;
– run command prisma generate to generate typescript data types that correspond to the database tables;
– execute the pnpm run dev command to run the application at the address localhost:3000.
