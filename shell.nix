# Note. pkgs.nodejs_16 is not a stable nodejs build.
## Use 'export `NIXPKGS_ALLOW_INSECURE=1` before running `nix-shell`

let
  pkgs = import <nixpkgs> { config = { allowUnfree = true; }; };
in
  pkgs.mkShell {

    # Define packages
    packages = [
      pkgs.which
      pkgs.vscode # export NIXPKGS_ALLOW_UNFREE=1
      pkgs.nodejs_20
    ];
    
    # Shell environments
    env = {
      MY_VAR = "my_var";
    };

    # Export to use the variable on shell child processes.
    # You can also execute shell on shell-nix entry such as creating directories.
    shellHook = ''
      echo "Hello! Your nix environment is working."
      export MY_VAR
    '';
  }

