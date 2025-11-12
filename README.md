#  Project Setup Guide (with Ollama Integration)

This guide explains how to install Ollama, configure this project, and run the DeepSeek-V3.1:671B-Cloud model locally or via the cloud.

------------------------------------------------------------
1. PREREQUISITES
------------------------------------------------------------

Before starting, make sure you have:

Node.js (v18 or later) and npm installed:
  node -v
  npm -v

Git installed:
  git --version

Ollama installed (see below)

------------------------------------------------------------
2. INSTALLING OLLAMA
------------------------------------------------------------

Ollama is required to run large language models locally or through the cloud.

For Linux (CachyOS, Arch, Ubuntu, Debian, Fedora, etc.):
  curl -fsSL https://ollama.com/install.sh | sh

For Arch-based systems (like CachyOS), you can also install from AUR:
  yay -S ollama

Verify installation:
  ollama --version

If it shows a version number (e.g. ollama version 0.4.2), you’re good to go.

------------------------------------------------------------
3. START AND CONFIGURE OLLAMA
------------------------------------------------------------

Start the Ollama service:
  ollama serve

This starts the Ollama server on localhost:11434.
Keep this running in a separate terminal window.

Sign in to your Ollama account:
  ollama signin

Follow the link in your browser to complete authentication.

Run the DeepSeek model (Cloud):
  ollama run deepseek-v3.1:671b-cloud

Ollama will download and start the DeepSeek-V3.1 (671B Cloud) model.
You’ll see a prompt like:
  >>> Hello, DeepSeek!

Type messages to chat with it, and exit with:
  /bye

------------------------------------------------------------
4. INSTALL PROJECT DEPENDENCIES
------------------------------------------------------------

In your project folder:
  npm install

or
  npm i

This installs all required modules listed in package.json.

------------------------------------------------------------
5. BUILD THE PROJECT
------------------------------------------------------------

Once dependencies are installed:
  npm run build

This compiles the project into a production-ready bundle.

------------------------------------------------------------
6. INSTALL THE PROJECT GLOBALLY (OPTIONAL)
------------------------------------------------------------

If you want to use this project as a global command:
  npm install -g .

After that, you can run the command from anywhere:
  cgm or cg

(Replace "your-command-name" with the actual CLI name defined in your package.json under the "bin" field.)

------------------------------------------------------------
7. VERIFY EVERYTHING WORKS
------------------------------------------------------------

Ensure Ollama is running:
  curl http://localhost:11434/api/version

Expected output:
  {"version": "0.4.2"}

Run your project and verify it connects successfully to the model.

------------------------------------------------------------
8. COMMAND REFERENCE
------------------------------------------------------------

Install Ollama:
  curl -fsSL https://ollama.com/install.sh | sh

Start Ollama:
  ollama serve

Sign in:
  ollama signin

Run DeepSeek Cloud Model:
  ollama run deepseek-v3.1:671b-cloud

Install project dependencies:
  npm install

Build the project:
  npm run build

Install globally:
  npm install -g .

Enable auto-start on boot:
The steps to enable Ollama to start automatically on boot may vary depending on your Linux distribution. Please refer to your distribution’s official documentation or wiki for detailed instructions.

------------------------------------------------------------
DONE!
------------------------------------------------------------

You’ve now installed Ollama, set up the DeepSeek cloud model, built the project, and configured it to run globally and persistently.
