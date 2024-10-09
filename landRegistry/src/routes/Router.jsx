import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home'
import ContractOwner from '../pages/ContractOwner'
import LandInspector from '../pages/LandInspector'
const Router = ()=>{
    return(
        <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/home" element={<Home />} />
         <Route path='/contractOwner' element={<ContractOwner/>}/>
         <Route path='/landInspector' element={<LandInspector/>}/>
        </Routes>
    )
}

export default Router