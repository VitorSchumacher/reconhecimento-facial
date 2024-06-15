import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  background-color: #282c34;
  color: white;
  padding: 20px;
`;

const Title = styled.h2`
  color: #9acd32;
  text-align: center;
  font-size: 24px;
`;

const CourseList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CourseItem = styled.li`
  background-color: #1b1f23;
  border: 1px solid #9acd32;
  border-radius: 4px;
  margin: 10px 0;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CourseName = styled.span`
  font-weight: bold;
`;

const ParticipantCount = styled.span`
  color: #9acd32;
`;

const ResultPage = () => {
  const [courseCounts, setCourseCounts] = useState({});

  useEffect(() => {
    const fetchCourseCounts = async () => {
      try {
        const response = await fetch('http://localhost:3005/contar-alunos');
        if (!response.ok) {
          throw new Error('Erro ao buscar contagem de alunos.');
        }
        const data = await response.json();
        setCourseCounts(data);
      } catch (error) {
        console.error('Erro ao buscar contagem de alunos:', error);
        // Tratar erro (exibir mensagem, etc.)
      }
    };

    fetchCourseCounts();
  }, []);

  useEffect(()=>{
    console.log(courseCounts)
  },[courseCounts])

  return (
    <>
      <Header />
      <Container>
        <Title>Contagem de Alunos por Curso</Title>
        <CourseList>
            {Object.keys(courseCounts).map((curso, index) => (
             <CourseItem key={index}>
             <CourseName>{curso}: </CourseName>
             <ParticipantCount>{courseCounts[curso]}</ParticipantCount>
           </CourseItem>
            ))}
        </CourseList>
      </Container>
      <Footer />
    </>
  );
};

export default ResultPage;
