import React from 'react';
import '../../../styles/CreateUser.css';
import { set, useForm } from 'react-hook-form'; //npm i react-hook-form
import { yupResolver } from "@hookform/resolvers/yup"; //npm i @hookform/resolvers
import * as yup from "yup"; //npm i yup
import axios from 'axios';//npm i axios
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';

const schema = yup.object().shape({
    username: yup.string().required('Usuário obrigatório'),
    email: yup.string().email('Email inválido').required('Email obrigatório'),
    password: yup
        .string()
        .min(5, 'Senha deve ter no mínimo 5 caracteres')
        .matches(/[!@#$%^&*-]/, 'Senha deve conter pelo menos um caractere especial')
        .required('Senha é obrigatória'),
    passwordConf: yup
        .string()
        .required('Confirme a senha')
        .oneOf([yup.ref('password')], 'As senhas devem coincidir!')
}).required();


export default function CreateUser() {

    const [msg, setMsg] = useState();

    const form = useForm({
        resolver: yupResolver(schema)
    });

    const { register, handleSubmit, formState } = form;

    const { errors } = formState;

    const submit = async (data) => {

        try {
            const response = await axios.post('http://localhost:3000/auth/create', data);
            if (response.status === 200)
                setMsg('OK');
        } catch (error) {
            setMsg(error.response.data);
        }
    }

    if (msg === 'OK')
        return <Navigate to='/' />

    return (
        <>
            <div class="container">
                <section class="cadastro">
                    <form onSubmit={handleSubmit(submit)} noValidate>
                        <p id="p-cadastro">Cadastro</p>
                        <div class="user">
                            <label htmlFor="username" placeholder="Nome">Seu nome</label>
                            <input type="text" id="username" {...register('username')} />
                            <p className='erro'>{errors.username?.message}</p>
                        </div>
                        <div class="user">
                            <label htmlFor="email" placeholder="E-mail">Seu e-mail</label>
                            <input type="text" id="email" {...register('email')} />
                            <p className='erro'>{errors.email?.message}</p>
                        </div>
                        <div class="user">
                            <label htmlFor="password" placeholder="Senha">Sua senha</label>
                            <input type="password" id="password" {...register('password')} />
                            <p className='erro'>{errors.password?.message}</p>
                        </div>
                        <div class="user">
                            <label htmlFor="password" placeholder="Senha">Confirme sua senha</label>
                            <input type="password" id="passwordConf" {...register('passwordConf')} />
                            <p className='erro'>{errors.passwordConf?.message}</p>
                        </div>

                        <button>Cadastrar</button>
                    </form>
                    <p className='server-response'>{msg}</p>
                    <section class="footer">
                        <p id="p-footer">Já possui conta? <Link to="/">Entre Agora</Link></p>
                    </section>
                </section>
            </div>
        </>

    )

}