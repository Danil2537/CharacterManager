# Character Manager

This is a wep-app project for creating and using D&D 5e (2024) characters
Made by Danilo Diedov and Maxim Gorlov as a university coursework.<br/>

You can check the app itself on: https://dndcharactermanager.netlify.app/<br/>

For running the app on localhost, you must:<br/>
Make sure you have git, pnpm, next.js and node.js installed.<br/>
In you IDE (preferably VS Code):
– go to the folder where the project should be located;<br/>
– run the command git clone  https://github.com/Danil2537/CharacterManager.git;<br/>
– add a .env file to the root folder of the project, which will contain the
environment variables DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY;
(you can write me a message to get those)<br/>
– run command pnpm install to load the application's dependencies;<br/>
– run command pnpm build to compile the application;<br/>
– run command prisma generate to generate typescript data types that correspond to the database tables;<br/>
– execute the pnpm run dev command to run the application at the address localhost:3000.
