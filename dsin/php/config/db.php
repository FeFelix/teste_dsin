<?php 
    class Database {
        private $host = "127.0.0.1";
        private $database_name = "db_teste_pg";
        private $username = "root";
        private $password = "";

        public $conn;

        public function getConnection(){
            $this->conn = null;
            try{
                $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->database_name, $this->username, $this->password);
                $this->conn->exec("set names utf8");
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }catch(PDOException $exception){
                echo "Conexão não realizada: " . $exception->getMessage();
            }
            return $this->conn;
        }
    }  
?>