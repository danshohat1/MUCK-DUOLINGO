import React, { useEffect, useState } from 'react';
import {
  Tooltip,
  Button,
  Typography,
  Grid,
  Container,
} from '@material-ui/core';

const FillSentence = ({ data, answer, setAnswer, realAnswer}) => {
  const [blocksBank, setBlocksBank] = useState(data.blocks);

  useEffect(() => {
    console.log("effect")
    if (blocksBank.length !== 9){
      setBlocksBank(data.blocks);
      
    } 
  },[realAnswer]);
  const handleBlockClick = (block) => {
    const newAnswer = [...answer, block];
    setAnswer(newAnswer);

    const newBlocksBank = blocksBank.filter((b) => b !== block);
    setBlocksBank(newBlocksBank);
    console.log(answer)
  };

  const handleRemoveBlock = (block) => {
    const newAnswer = answer.filter((b) => b !== block);
    setAnswer(newAnswer);

    setBlocksBank([...blocksBank, block]);
    console.log(answer)
  };

  // Check if there is existing blocksBank before setting
  return (
    <Container style={{ marginTop: '16px', padding: '16px' }}>


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '16px', overflowX: 'auto' }}>
        {answer.map((block, index) => (

          <Button
            style={{ margin: '8px', cursor: 'pointer' }}
            onClick={() => handleRemoveBlock(block)}
            variant="contained"
          >
            {Object.keys(block)[0]}
          </Button>
        ))}
      </div>

      <div style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {blocksBank.map((block, index) => (

          <Button
            style={{ margin: '8px', cursor: 'pointer' }}
            onClick={() => handleBlockClick(block)}
            variant="outlined"
          >
            {Object.keys(block)[0]}
          </Button>

        ))}
      </div>
    </Container>
  );
};


export default FillSentence;
