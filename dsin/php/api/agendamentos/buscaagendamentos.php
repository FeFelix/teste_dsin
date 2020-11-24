<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    
    include_once '../../config/db.php';
    include_once '../../classes/agendamentos.php';

    $resultado = new stdClass();

    $database = new Database();
    $db = $database->getConnection();

    $classe = new Agendamentos($db);

    $condicao = "";

    if(isset($_GET['id_usuario'])){
        $condicao .= $condicao == "" ? " WHERE " : " AND ";
        $condicao .= "ag.id_usuario = ". htmlspecialchars(strip_tags($_GET['id_usuario']));
    }

    if(isset($_GET['servico'])){
        $condicao .= $condicao == "" ? " WHERE " : " AND ";
        $condicao .= "ag.id_servico = ". htmlspecialchars(strip_tags($_GET['servico']));
    }

    if(isset($_GET['situacao'])){
        if($_GET['situacao'] != ''){
            $condicao .= $condicao == "" ? " WHERE " : " AND ";
            $condicao .= "ag.situacao = ". htmlspecialchars(strip_tags($_GET['situacao']));
        }
    }
    
    if(isset($_GET['datainicio']) && isset($_GET['datafim'])){
        $condicao .= $condicao == "" ? " WHERE " : " AND ";
        $condicao .= "ag.data BETWEEN CAST('". htmlspecialchars(strip_tags($_GET['datainicio'])) . "' AS DATE ) AND CAST('". htmlspecialchars(strip_tags($_GET['datafim'])) ."' AS DATE)";
    }

    $classe->condicao = $condicao;

    $res = $classe->buscaAgendamentos();

    if($res->retorno != "OK"){
        $resultado->retorno = "ERRO";
        $resultado->msg = $res->msg;
        echo json_encode($resultado);
    }
    else{
        $resultado->retorno = "OK";
        $resultado->dados = array();
        while ($dados = $res->sth->fetch(PDO::FETCH_OBJ)){
            if($dados->situacao == 1){
                $dados->_rowVariant = "success";
                $dados->situacao_desc = "Confirmado";
            }
            else if($dados->situacao == 2){
                $dados->_rowVariant = "info";
                $dados->situacao_desc = "Finalizado";
            }
            else if($dados->situacao == 3){
                $dados->_rowVariant = "warning";
                $dados->situacao_desc = "Cancelado";
            }
            else {
                $dados->situacao_desc = "Arguardando";
            }
            $resultado->dados[] = $dados;
        }

        echo json_encode($resultado);
    }
?>