<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    
    include_once '../../config/db.php';
    include_once '../../classes/clientes.php';

    $resultado = new stdClass();

    $database = new Database();
    $db = $database->getConnection();

    $classe = new Clientes($db);

    $res = $classe->buscaClientes();

    if($res->retorno != "OK"){
        $resultado->retorno = "ERRO";
        $resultado->msg = $res->msg;
        echo json_encode($resultado);
    }
    else{
        $resultado->retorno = "OK";
        $resultado->dados = array();
        while ($dados = $res->sth->fetch(PDO::FETCH_OBJ)){
            $resultado->dados[] = $dados;
        }

        echo json_encode($resultado);
    }
?>