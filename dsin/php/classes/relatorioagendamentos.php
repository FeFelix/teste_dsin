<?php

    class RelatorioAgendamentos{
        private $conn;
        
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
    }
?>