# GROUPOMANIA

Social Network simulation for a fictional Brand.

There's a link to the "live" website. Leave me a message, it will make me happy ;)! 

https://groupomania.robin-lebon.com/

## Installation
Make sure to have:

NodeJs on is latest stable version or at least 16.13.2


**Install the Backend** via this command.


```bash
cd backend
npm install
```

**Install the Frontend** via this command.


```bash
cd frontend
npm install
```


> Make sure to install the SQL file in your Database software manager 


**In phpMyAdmin**

- Select the destination database that you named "groupomania" on the left panel.

-  click on the "Import" tab 
![PHPMYADMIN TABS](https://kbimages.dreamhosters.com/images/2018-05_mysql_importing_database_01.png)



- Under the "File to import" section, click Browse and locate the file with the .sql extension you wish to import.

- Uncheck the boxes for 'Partial import' and 'Other options'.

- From the Format dropdown menu choose 'SQL'.
- Click the Go button at the bottom to import the database.

> In the backend folder change the .env.example variables with your informations 
 and rename it  .env

## Usage


Launch the front and back in 2 separate terminals

```bash
cd backend
npm start
```
> Should start Backend Server on port 3500 
```bash
cd frontend
npm start
```
>Should start Frontend dev mode on port 3000

**To give Admin rights to a user, put 1 in the admin column in 'utilisateur' TABLE.**


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



## License
[MIT](https://choosealicense.com/licenses/mit/)
