{ pkgs, ... }: {
  # Let Nix handle our packages
  packages = [
    pkgs.nodejs_20
  ];

  # Set up our environment variables
  env = {
    # This is a placeholder for the service account key.
    # You should replace this with a secure way to manage secrets in a production environment.
    GOOGLE_APPLICATION_CREDENTIALS = "config/serviceAccountKey.json";
  };

  # IDE extensions
  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
    ];
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        npm-install = "npm install";
      };
      # Runs every time the workspace is (re)started
      onStart = {
        dev-server = "npm run dev";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
        };
      };
    };
  };
}
