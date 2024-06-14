import styled from "styled-components"

const Main = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    background-color: #282c34;
    border-top: 1px solid #9acd32;
    p{
        color: #fff;
    }
    img{
        width: 150px;
    }
`
const Footer = () => {
    return(
        <Main>
            <p>Desenvolvido por:</p>
            <img src="images/logosi.png" alt="Logo de sistemas da informação"/>
        </Main>
    )
}

export default Footer