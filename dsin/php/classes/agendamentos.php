<?php

    class Agendamentos{
        private $conn;

        public $id;
        public $id_usuario;
        public $id_servico;
        public $valor;
        public $data;
        public $situacao;
        public $condicao;

        public function __construct($db){
            $this->conn = $db;
        }

        public function buscaAgendamentos(){
            $resultado = new stdClass();

            $sql = "SELECT ag.*, u.nome, s.descricao from agendamentos ag 
            LEFT OUTER JOIN usuarios u ON u.id = ag.id_usuario
            LEFT OUTER JOIN servicos s ON s.id = ag.id_servico
            {$this->condicao} ORDER BY data";
            $sth = $this->conn->prepare($sql);

            try {
                $sth->execute();
                $resultado->sth = $sth;
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK";            
            return $resultado;
        }

        public function incluirAgendamento(){
            $resultado = new stdClass();
        
            $this->id_servico = htmlspecialchars(strip_tags($this->id_servico));
            $this->id_usuario = htmlspecialchars(strip_tags($this->id_usuario));
            $this->data = htmlspecialchars(strip_tags($this->data));

            $valor = 0;
            $sql = "SELECT valor FROM servicos WHERE id = :id_servico";
        
            $sth = $this->conn->prepare($sql);
        
            try{
                $sth->bindParam(":id_servico", $this->id_servico);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            if($dados = $sth->fetch(PDO::FETCH_OBJ)){
                $valor = $dados->valor;
            }

            if($valor == 0 || $valor == null)
            {
                $resultado->retorno = "ERRO";
            $resultado->msg = "Não foi possível realizar o agendamento";
                return $resultado;
            }

            $sql = "INSERT INTO agendamentos (id_servico, id_usuario, data, valor) 
            VALUES(:id_servico, :id_usuario, :data, :valor)";
        
            $sth = $this->conn->prepare($sql);
        
            $this->id_servico = htmlspecialchars(strip_tags($this->id_servico));
            $this->id_usuario = htmlspecialchars(strip_tags($this->id_usuario));
            $this->data = htmlspecialchars(strip_tags($this->data));
        
            try{
                $sth->bindParam(":id_servico", $this->id_servico);
                $sth->bindParam(":id_usuario", $this->id_usuario);
                $sth->bindParam(":data", $this->data);
                $sth->bindParam(":valor", $valor);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK";   
         
            return $resultado;
        }    

        public function cancelarAgendamento(){
            $resultado = new stdClass();            
        
            $this->id = htmlspecialchars(strip_tags($this->id));

            $sql = "SELECT data FROM agendamentos WHERE id = :id";
        
            $sth = $this->conn->prepare($sql);
        
            try{
                $sth->bindParam(":id", $this->id);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            if($dados = $sth->fetch(PDO::FETCH_OBJ)){
                $dt1 = date_create($dados->data);
                $dt2 = date_create(date('Y-m-d'));

                $diff = date_diff($dt1, $dt2);

                $dias = $diff->format("%R%a days");

                if($dias > 2){                    
                    $resultado->retorno = "TEMPO";
                    $resultado->msg = "Tempo para agendamento ser cancelado encerrado. Por favor para poder cancelar entre em contato por telefone";
                    return $resultado;
                }
            }

            $sql = "UPDATE agendamentos SET situacao = :situacao WHERE id = :id";
        
            $sth = $this->conn->prepare($sql);
        
            try{
                $sth->bindParam(":id", $this->id);
                $sth->bindParam(":situacao", $this->situacao);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK"; 
         
            return $resultado;
        }

        public function alterarAgendamento(){
            $resultado = new stdClass();
        
            $this->id_servico = htmlspecialchars(strip_tags($this->id_servico));
            $this->id_usuario = htmlspecialchars(strip_tags($this->id_usuario));
            $this->data = htmlspecialchars(strip_tags($this->data));
            $this->id = htmlspecialchars(strip_tags($this->id));

            $valor = 0;
            $sql = "SELECT valor FROM servicos WHERE id = :id_servico";
        
            $sth = $this->conn->prepare($sql);
        
            try{
                $sth->bindParam(":id_servico", $this->id_servico);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            if($dados = $sth->fetch(PDO::FETCH_OBJ)){
                $valor = $dados->valor;
            }

            if($valor == 0 || $valor == null)
            {
                $resultado->retorno = "ERRO";
                $resultado->msg = "Não foi possível realizar a alteração do agendamento";
                return $resultado;
            }

            $sql = "UPDATE agendamentos SET id_servico = :id_servico, id_usuario = :id_usuario, data = :data, valor = :valor WHERE id = :id";
        
            $sth = $this->conn->prepare($sql);
        
            try{
                $sth->bindParam(":id_servico", $this->id_servico);
                $sth->bindParam(":id_usuario", $this->id_usuario);
                $sth->bindParam(":data", $this->data);
                $sth->bindParam(":valor", $valor);
                $sth->bindParam(":id", $this->id);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK";   
         
            return $resultado;
        } 

        public function cancelarAgendamentoAdmin(){
            $resultado = new stdClass();            
        
            $this->id = htmlspecialchars(strip_tags($this->id));

            $sql = "UPDATE agendamentos SET situacao = :situacao WHERE id = :id";
        
            $sth = $this->conn->prepare($sql);
        
            try{
                $sth->bindParam(":id", $this->id);
                $sth->bindParam(":situacao", $this->situacao);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK"; 
         
            return $resultado;
        }

        public function confirmarAgendamento(){
            $resultado = new stdClass();            
        
            $this->id = htmlspecialchars(strip_tags($this->id));

            $sql = "UPDATE agendamentos SET situacao = :situacao WHERE id = :id";
        
            $sth = $this->conn->prepare($sql);
        
            try{
                $sth->bindParam(":id", $this->id);
                $sth->bindParam(":situacao", $this->situacao);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK"; 
         
            return $resultado;
        }
    }
?>