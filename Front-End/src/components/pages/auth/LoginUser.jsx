import React from 'react'
import '../../../styles/LoginUser.css';
import { set, useForm } from 'react-hook-form'; //npm i react-hook-form
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

//Objeto para validação de campos com yup
const schema = yup.object({
    email: yup.string().email('Email inválido').required('Email obrigatório'),
    password: yup.string().min(2, 'Senha com no mínimo 2 caracteres').required(),
}).required();


export default function LoginUser() {

    //Msg para armazenar resposta literal do servidor
    const [msg, setMsg] = useState(' ');

    const form = useForm({
        resolver: yupResolver(schema)
    });

    const { register, handleSubmit, formState } = form;

    const { errors } = formState;

    const submit = async (data) => {

        try {
            const response = await axios.post('http://localhost:3000/auth/login', data);
            sessionStorage.setItem('token', response.data);
            setMsg('Usuário Autenticado');
        } catch (error) {
            setMsg(error.response.data);
        }

    }

    if (msg.includes('Usuário Autenticado')) {
        return <Navigate to='/listar-propriedades' />
    }

    return (

        <>
            <div class="container">
                <section class="login">
                    <form onSubmit={handleSubmit(submit)} noValidate>
                        <p id="p-login">Login</p>
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
                        <button>Entrar</button>
                    </form>
                    <p className="server-response">{msg}</p>

                    <section class="footer">
                        <p id="p-footer">Não possui conta? <Link to="/criar-user">Entre Agora</Link></p>
                    </section>
                    
                </section>
            </div>
        </>
    )

}