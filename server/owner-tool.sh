#!/bin/bash

prompt_exit() {
  read -p "Press Enter to continue, or 'c' to exit..."
  if [[ "$REPLY" == "c" || "$REPLY" == "C" ]]; then
    echo "Exiting..."
    exit
  fi
}

while true; do
  echo "What would you like to do? (Enter the number)"

  echo "1. Create an admin"

  echo "2. Remove an admin"

  echo "3. Warn user"

  echo "4. Unwarn user"

  echo "5. Update Warn"

  echo "6. Ban user"

  echo "7. Unban user"

  echo "8. Update ban"

  echo "Press 'c' and Enter to exit or any other key to continue..."

  read choice

  case $choice in
    1)
      node "scripts/create-admin.js"
      prompt_exit
      ;;
    2)
      node "scripts/remove-admin.js"
      prompt_exit
      ;;  
    3)
      node "scripts/warn-user.js"
      prompt_exit
      ;;
    4)
      node "scripts/unwarn-user.js"
      prompt_exit
      ;;
    5)
      node "scripts/update-warn.js"
      prompt_exit
      ;;
    6)
      node "scripts/ban-user.js"
      prompt_exit
      ;;
    7)
      node "scripts/unban-user.js"
      prompt_exit
      ;;
    8)
      node "scripts/update-ban.js"
      prompt_exit
      ;;    
    c|C)
      echo "Exiting..."
      exit
      ;;
    *)
      echo "Invalid input, please try again."
      ;;
  esac

done