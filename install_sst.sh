#!/bin/bash
set -euo pipefail
APP=sst

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[38;2;255;140;0m'
NC='\033[0m' # No Color

os=$(uname -s | tr '[:upper:]' '[:lower:]')
if [[ "$os" == "darwin" ]]; then
    os="mac"
fi
arch=$(uname -m)

if [[ "$arch" == "aarch64" ]]; then 
  arch="arm64"
fi

filename="$APP-$os-$arch.tar.gz"

case "$filename" in
    *"-linux-"*)
        [[ "$arch" == "x86_64" || "$arch" == "arm64" || "$arch" == "i386" ]] || exit 1
    ;;
    *"-mac-"*)
        [[ "$arch" == "x86_64" || "$arch" == "arm64" ]] || exit 1
    ;;
    *)
        echo "${RED}Unsupported OS/Arch: $os/$arch${NC}"
        exit 1
    ;;
esac

INSTALL_DIR=$HOME/.sst/bin
mkdir -p "$INSTALL_DIR"
sst_version=$(cat sst-version-lock.txt)
url="https://github.com/sst/ion/releases/download/v$sst_version/$filename"
echo $url

if [[ $? -ne 0 ]]; then
    echo "${RED}Failed to fetch version${NC}"
    exit 1
fi

print_message() {
    local level=$1
    local message=$2
    local color=""

    case $level in
        info) color="${GREEN}" ;;
        warning) color="${YELLOW}" ;;
        error) color="${RED}" ;;
    esac

    echo -e "${color}${message}${NC}"
}

check_version() {
    if command -v sst >/dev/null 2>&1; then
        sst_path=$(which sst)
        sst_shebang=$(cat $sst_path | head -n1)

        if [[ "$sst_shebang" == "#!/usr/bin/env node" ]]; then
            print_message error "SST v2 is installed globally through npm. You'll need to uninstall it before proceeding."
            exit 1
        fi

        installed_version=$(sst version)

        if [[ "$installed_version" != "$sst_version" ]]; then
            print_message info "Installed version: ${YELLOW}$installed_version."

            # print_message info "Version ${YELLOW}$installed_version${GREEN} is installed, upgrading to ${YELLOW}$sst_version${GREEN}? [Y/n]${NC}"
            # read -n 1 -r
            # echo
            # if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            #     exit 1
            # fi
        else
            print_message info "version ${YELLOW}$sst_version${GREEN} already installed"
            exit 0
        fi
    fi
}

download_and_install() {
    print_message info "Downloading ${ORANGE}SST ❍ ion ${GREEN}version: ${YELLOW}$sst_version ${GREEN}..."
    mkdir -p ssttmp && cd ssttmp
    curl -# -L $url | tar xz
    mv sst $INSTALL_DIR
    cd .. && rm -rf ssttmp
}

check_version
download_and_install

add_to_path() {
    local config_file=$1
    local command=$2

    if [[ -w $config_file ]]; then
        echo -e "\n# sst" >> "$config_file"
        echo "$command" >> "$config_file"
        print_message info "Successfully added ${ORANGE}SST ❍ ion ${GREEN}to \$PATH in $config_file"
    else
        print_message warning "Manually add the directory to $config_file (or similar):"
        print_message info "  $command"
    fi
}

XDG_CONFIG_HOME=${XDG_CONFIG_HOME:-$HOME/.config}

current_shell=$(basename "$SHELL")
case $current_shell in
    fish)
        config_files="$HOME/.config/fish/config.fish"
    ;;
    zsh)
        config_files="$HOME/.zshrc $HOME/.zshenv $XDG_CONFIG_HOME/zsh/.zshrc $XDG_CONFIG_HOME/zsh/.zshenv"
    ;;
    bash)
        config_files="$HOME/.bashrc $HOME/.bash_profile $XDG_CONFIG_HOME/bash/.bashrc $XDG_CONFIG_HOME/bash/.bash_profile"
    ;;
    ash)
        config_files="$HOME/.ashrc $HOME/.profile /etc/profile"
    ;;
    *)
        # Default case if none of the above matches
        config_files="$HOME/.bashrc $HOME/.bash_profile $XDG_CONFIG_HOME/bash/.bashrc $XDG_CONFIG_HOME/bash/.bash_profile"
    ;;
esac

config_file=""
for file in $config_files; do
    if [[ -f $file ]]; then
        config_file=$file
        break
    fi
done

if [[ -z $config_file ]]; then
    print_message error "No config file found for $current_shell. Checked files: ${config_files[@]}"
    exit 1
fi

if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
    case $current_shell in
        fish)
            add_to_path "$config_file" "fish_add_path $INSTALL_DIR"
        ;;
        zsh)
            add_to_path "$config_file" "export PATH=$INSTALL_DIR:\$PATH"
        ;;
        bash)
            add_to_path "$config_file" "export PATH=$INSTALL_DIR:\$PATH"
        ;;
        ash)
            add_to_path "$config_file" "export PATH=$INSTALL_DIR:\$PATH"
        ;;
        *)
            print_message warning "Manually add the directory to $config_file (or similar):"
            print_message info "  export PATH=$INSTALL_DIR:\$PATH"
        ;;
    esac
fi

if [ -n "${GITHUB_ACTIONS-}" ] && [ "${GITHUB_ACTIONS}" == "true" ]; then
    echo "$INSTALL_DIR" >> $GITHUB_PATH
    print_message info "Added $INSTALL_DIR to \$GITHUB_PATH"
fi