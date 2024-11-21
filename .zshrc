# ====================
# Path Configurations
# ====================
# Homebrew
export PATH="/opt/homebrew/bin:$PATH"
eval "$(/opt/homebrew/bin/brew shellenv)"

# Flutter
export PATH="$PATH:/Users/muhamadriansyah/fvm/default/bin"

# Go
export PATH="/opt/homebrew/opt/go@1.22/bin:$PATH"
export PATH=$PATH:$(go env GOPATH)/bin

# Python - pyenv
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"

# ====================
# Development Tools
# ====================
# NVM Configuration
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"

# Shell Customization
eval "$(starship init zsh)"
source "$(dirname "$(gem which colorls)")/tab_complete.sh"
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'

# ====================
# Docker Commands
# ====================
STOPALL='docker stop $(docker ps -q)'
STARTALL='docker start $(docker ps -a -q)'
REMOVEALL='docker rm $(docker ps -a -q)'
IMAGEREMOVEALL='docker rmi $(docker images -q)'
STOPREMOVE="$STOPALL && $REMOVEALL"

# ====================
# Aliases
# ====================
# Navigation
alias bb="cd .."
alias cl="clear"
alias md="mkdir"
alias project="cd Documents/PROJECT"
alias joinan="cd Documents/PROJECT/Joinan"
alias samir="cd Documents/PROJECT/Samir"
alias pijar="cd Documents/PROJECT/Pijar"

# Git
alias add="git add"
alias all="git add ."
alias commit="git commit -m"
alias amend="git commit --amend"
alias push="git push origin"
alias pull="git pull origin"
alias clone="git clone"
alias status="git status"
alias switch="git checkout"
alias newbranch="git checkout -b"
alias rebase="git rebase dev"
alias branches="git branch"

# Development
alias fi="fvm flutter pub add"
alias c="code ."
alias cur="cursor ."
alias dev="npm run dev"
alias serve="npm run serve"
alias ndev="nr dev"
alias ins="ni"
alias deps="npm i"
alias use="nvm use"
alias wstorm="open -na 'WebStorm.app' --args"

# Docker
alias stopall="$STOPALL"
alias startall="$STARTALL"
alias removeall="$REMOVEALL"
alias imageremoveall="$IMAGEREMOVEALL"
alias stopremove="$STOPREMOVE"
alias buildall="docker compose down --rmi all && docker compose up -d --build"
alias buildstaging="docker compose up -d --build staging"
alias buildprod="docker compose up -d --build production"
alias buildlocal="docker-compose up -d --force-recreate --build staging && docker system prune -f"

# System
alias res="exec zsh -l"
alias shell="code ~/.zshrc"
alias ls="colorls"

# Server
alias openserver1="ssh -i PijarLP.pem pijar-tech@103.175.221.73"
alias openserver2="ssh -i PijarLP.pem pijar-tech@103.150.92.77"
alias gcp="gcloud "

# ====================
# Optional Configurations (Currently Commented)
# ====================
# # Load zsh-syntax-highlighting
# source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# # Google Cloud SDK
# if [ -f '/Users/muhamadriansyah/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/muhamadriansyah/google-cloud-sdk/path.zsh.inc'; fi
# if [ -f '/Users/muhamadriansyah/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/muhamadriansyah/google-cloud-sdk/completion.zsh.inc'; fi

