import { useState, useEffect, Dispatch, SetStateAction } from 'react'


type Props = {
  setImage: Dispatch<SetStateAction<string | null>>,
}


export const UploadImage: React.FC<Props> = ({
  setImage = () => { },
}) => {

  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
  //  const [base64IMG, setBase64IMG] = useState<string | null>(null)


  const convertToBase64 = (selectedFile: any) => {
    const reader = new FileReader()

    reader.readAsDataURL(selectedFile)

    reader.onload = () => {
      //console.log('called: ', reader)
      setImage(reader?.result as string)

      //console.log(reader.result)
    }
  }

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl: any = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    //console.log('objectUrl', objectUrl)

    convertToBase64(selectedFile)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }

    setSelectedFile(e.target.files[0])
  }

  return (
    <div style={{ marginTop: '10px' }}>
      {/* <input type='file' onChange={onSelectFile} /> */}
      <label htmlFor="filePicker" style={{ padding: "5px 10px", cursor: 'pointer', backgroundColor: '#1769aa', color: 'white', borderRadius: '10px' }}>
        Select file
      </label>
      <input id="filePicker" style={{ visibility: "hidden" }} type={"file"} onChange={onSelectFile}></input>
      {selectedFile && <img src={preview} width={50} height={'auto'} style={{ border: '1px solid #eee', borderRadius: '10px' }} />}
    </div>
  )
}