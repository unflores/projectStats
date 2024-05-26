import Card from '@/rcl/atoms/Card';
import Container from '@/rcl/atoms/Container'
import Title from '@/rcl/atoms/Title';

import Parser from './Parser.tsx';

const ParcelParserPage = () => {


  return(
    <Container className="">
      <Card>
      <Title level={2}>Import parcel data</Title>
      <Parser/>

      </Card>

    </Container>
  )
}

export default ParcelParserPage;
