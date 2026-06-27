# TO-DO
to-do website(application) to suit mine needs
## function:
1)shows the tasks for the current day\
2)focus on the 3 main goals of the week

1. Настройка СКВ Git в среде WSL, Подключение Ubuntu к моему проводнику, клонирование репозитория, синхронизация GitHub через VS Code

   Используемые инструменты:
   - WSL (Windows Subsystem for Linux) — Ubuntu 20.04/22.04
   - Git — версия 2.43.0 (установлен внутри WSL)
   - VS Code — с расширением Git (Source Control)
   - GitHub — удалённый хостинг репозитория

                 1.1 Установка и настройка Git в WSL
были полностью удален Git и была проведена чистка мусора (ненужные зависимости)
<img width="465" alt="image" src="https://github.com/user-attachments/assets/cd1ef25b-4e3d-4acb-b022-d8f1e65df5fe" />\
*sudo apt autoremove* - Удаляет зависимости (библиотеки), которые были установлены вместе с Git, но теперь, после удаления Git, они стали не нужны.\
*sudo apt clean* - это команда для очистки кэша загруженных пакетов.\
*sudo apt update* - обновляет список доступных пакетов (программ) в вашей системе.
<img width="465" alt="image" src="https://github.com/user-attachments/assets/d0d2971a-9522-4061-9fad-2795a48f862c" />
<img width="465" alt="image" src="https://github.com/user-attachments/assets/a7b6e50a-95c4-4cf0-8a63-967943c7d2ef" />

                 1.2 проблема: VS Code не видел SSH-ключ. Также ссора ключей, был установлен другой ключ\
Решение: \
<img width="465" height="353" alt="2026-06-27_18-12-56" src="https://github.com/user-attachments/assets/3fee64ba-4432-4024-8a35-d16fb899c7f3" />\
*ssh-agent* - это системная служба Windows, которая управляет закрытыми SSH-ключами и предоставляет их для аутентификации при обращении к удалённым репозиториям (например, GitHub) через протокол SSH.\
*Set-Service -Name ssh-agent -StartupType Manual* - устанавливает тип запуска службы ssh-agent в значение Manual (вручную)\
*Start-Service ssh-agent* - запуск службы\
*Get-Service ssh-agent* - проверка состояния службы\
*ssh-add id_ed25519* - добавление ключа в SSH-агент









