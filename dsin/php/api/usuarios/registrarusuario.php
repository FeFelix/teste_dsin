<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    include_once '../../config/db.php';
    include_once '../../classes/usuarios.php';
    
    $resultado = new stdClass();
    
    $database = new Database();
    $db = $database->getConnection();
    
    $classe = new Usuarios($db);
    
    $data = json_decode(file_get_contents("php://input"));

    if(!isset($data->nome) || !isset($data->email) || !isset($data->cpf) || !isset($data->senha) || !isset($data->gerencial)){
        $resultado->retorno = "ERRO";
        $resultado->msg = "Estrutura inválida";
        echo json_encode($resultado);
    }
    else{
        $classe->nome = $data->nome;
        $classe->email = $data->email;
        $classe->cpf = $data->cpf;
        $classe->senha = $data->senha;
        $classe->gerencial = $data->gerencial;
        
        $res = $classe->registrarUsuario();

        if($res->retorno != "OK"){
            $resultado->retorno = "ERRO";
            $resultado->msg = $res->msg;
            echo json_encode($resultado);
        }
        else{
            $resultado->retorno = "OK";
            echo json_encode($resultado);
        }
    }
?>