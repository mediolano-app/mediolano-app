import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { pinataClient } from '@/utils/pinataClient';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(request: NextRequest){
    try{
      // const mockedData = {
      //     title: 'mocktitle',
      //     description: 'mockdescription',
      //     author: 'mockauthor',
      //     type: 'mocktype',
      //     uploadFile:''
      // };
  
      const data = await request.formData();

      const name = data.get('name') as unknown as string;
      const description = data.get('description') as unknown as string;
      const author = data.get('author') as unknown as string;
      const type = data.get('type') as unknown as string;
     // const uploadFile = data.get('uploadFile') as File | null;
      const image = data.get('image') as unknown as string;
      const version = data.get('version') as unknown as string;
      const external_url = data.get('external_url') as unknown as string;

  
      //const file: File | null = data.get("file") as unknown as File;

      // const uploadMockedData = await pinataClient.upload.json(mockedData);
      // const mockedUrl = await pinataClient.gateways.convert(uploadMockedData.IpfsHash);
      // console.log(mockedUrl);

      const userObject = {
        name,
        description,
        author,
        type,
        //uploadFile: uploadFile ? uploadFile.name : null,
        image,
        version,
        external_url,
      };

      const uploadData = await pinataClient.upload.json(userObject);

      //aqui eu chamo a função de MINTAR
      return NextResponse.json({ uploadData }, { status: 200 });
    } catch (e) {
      console.log(e);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    } 
  }