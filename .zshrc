# Load Flutter
export PATH="$PATH:/Users/muhamadriansyah/fvm/default/bin"

# Load NVM
export NVM_DIR="$HOME/.nvm"
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"

# Load pyenv
# export PYENV_ROOT="$HOME/.pyenv"
# export PATH="$PYENV_ROOT/bin:$PATH"
# eval "$(pyenv init --path)"

# Load Homebrew
export PATH="/opt/homebrew/bin:$PATH"

# Load Starship prompt
eval "$(starship init zsh)"

# Load Homebrew environment variables
eval "$(/opt/homebrew/bin/brew shellenv)"

# Load colorls tab completion
source "$(dirname "$(gem which colorls)")/tab_complete.sh"

zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'

alias ls="colorls"

# Aliases
alias bb="cd .."
alias cl="clear"
alias md="mkdir"
alias add="git add"
alias all="git add ."
alias commit="git commit -m"
alias amend="git commit --amend"
alias push="git push origin"
alias pull="git pull origin"
alias clone="git clone"
alias status="git status"
alias switch="git switch"
alias newbranch="git checkout -b"
alias fi="fvm flutter pub add"
alias c="code ."
alias dev="npm run dev"
alias serve="npm run serve"
alias ndev="nr dev"
alias ins="ni"
alias deps="npm i"
alias res="exec zsh -l"
alias shell="code ~/.zshrc"
alias joinan="cd Documents/PROJECT/Joinan"
alias samir="cd Documents/PROJECT/Samir"
alias project="cd Documents/PROJECT"
alias pijar="cd Documents/PROJECT/Pijar"
alias use="nvm use"
alias stopall="docker stop $(docker ps -q)"
alias buildall="docker-compose up -d --build"
alias buildstaging="docker-compose up -d --build nuxt-app-staging"
alias buildprod="docker-compose up -d --build nuxt-app-prod"

# Load zsh-syntax-highlighting
source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
