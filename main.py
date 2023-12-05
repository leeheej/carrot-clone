from fastapi import FastAPI, UploadFile,Form,Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from typing import Annotated
import sqlite3

con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor()

app = FastAPI()

@app.post('/prd')
async def creat_prd(images:UploadFile,
              title:Annotated[str,Form()],
              price:Annotated[int,Form()],
              description:Annotated[str,Form()],
              plac:Annotated[str,Form()],
                insertAt:Annotated[int,Form()],):
    
    image_bytes = await images.read()
    cur.execute(f"""
                INSERT INTO prd (title,images,price,description,plac,insertAt)
                VALUES ('{title}','{image_bytes.hex()}',{price},'{description}','{plac}',{insertAt})
                """)
    con.commit()
    return '200'
    
@app.get('/prd')
async def get_prd():
    con.row_factory = sqlite3.Row
    cur = con.cursor() #db에서 위치를 cursor라고 표현함. 위치 업데이트를 해줘야함
    
    #그냥 SELECT * FROM하게되면 컬럼명은 안가져오므로, 컬럼명도 함께 불러오게하는 구문
    # array 형식으로 [1,'식칼','상태좋습니다'...]이렇게 보내지면 id가 뭐고 가격이 뭐고 장소가 뭔지 구분안됨
    # rows = [["id":1], ["title":"식칼"],...]이런 식으로 변경됨
    # dict(row) for row in rows 객체 형식으로 바꿔주는 구문
    # [id:1, title:"식칼",...] 결과
    rows = cur.execute(f"""
                       SELECT * FROM prd;
                       """).fetchall()
    # return JSONResponse(rows) / 이렇게 하게되면 prd테이블의 값들을 리스트 형식으로 나열되서 받으므로 정리가 안되므로 dict를 사용함.
    #return JSONResponse(dict(rows) for row in rows)
    # TypeError: Object of type generator is not JSON serializable 라는 에러가 뜸
    # 데이터가 제이슨 형식이 아니라서 인코드 해줘야함 /from fastapi.encoders import jsonable_encoder
    return JSONResponse(jsonable_encoder(dict(row) for row in rows))

@app.get('/images/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    image_bytes = cur.execute(f"""
                             SELECT images FROM prd WHERE id={item_id}
                             """).fetchone()[0] #하나만 가져올때 문법. 튜블이라는 데이터 타입으로 내려오는데 겉의 껍데기 벗기기위한 용도. hex(16진법)으로 가져옴
    return Response(content=bytes.fromhex(image_bytes)) #컨텐츠를 이진법 byte를 16진법으로 바꿔서 리스폰스. image_byte에서 가져옴
    
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")