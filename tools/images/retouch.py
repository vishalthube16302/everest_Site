import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
PUB='D:/Shared Folder/Work Data/Website/everest_Site/public/'
im=Image.open('raw/1776517436167_Pallet_Truck_with_weighing_Scale.jpg.jpg').convert('RGB')
a=np.asarray(im).astype(float).copy()
# Remove the third-party name on the indicator faceplate: rebuild each row from the clean blue either side
x0,x1,y0,y1=2076,2222,344,373
for y in range(y0,y1):
    l=a[y,x0-12:x0-3].mean(0); r=a[y,x1+2:x1+11].mean(0)
    for x in range(x0,x1):
        t=(x-x0)/(x1-x0); a[y,x]=l*(1-t)+r*t
out=Image.fromarray(a.astype('uint8'))
d=ImageDraw.Draw(out)
d.text((2149,359),'EVEREST',fill=(236,240,248),font=ImageFont.truetype('arialbd.ttf',20),anchor='mm')
# Everest mark on the flat face of the yellow frame, sheared to sit on the panel
logo=Image.open(PUB+'Top_Logo.jpeg').convert('RGB');L=np.asarray(logo).astype(float)
al=np.clip((255-L[...,1])/243,0,1); al[al<.08]=0
rgba=np.zeros(L.shape[:2]+(4,),'uint8');rgba[...,:3]=(200,16,20);rgba[...,3]=(al*255).astype('uint8')
lg=Image.fromarray(rgba,'RGBA')
mark=lg.crop((35,5,470,335)); word=lg.crop((478,50,1515,225))
S=Image.new('RGBA',(435,330+95),(0,0,0,0));S.paste(mark,(0,0),mark)
w2=word.resize((435,int(175*435/1037)),Image.LANCZOS);S.paste(w2,(0,335),w2)
W=160;Hh=int(S.height*W/S.width);s=S.resize((W,Hh),Image.LANCZOS)
shear=-0.16
s=s.transform((W,Hh+int(abs(shear)*W)),Image.AFFINE,(1,0,0,shear,1,0),Image.BICUBIC)
out=out.convert('RGBA');out.alpha_composite(s,(862,1690));out=out.convert('RGB')
out.save('scale_retouched.png')
out.crop((560,1120,1260,2240)).resize((438,700)).save('chk_a.png')
out.crop((1950,300,2330,420)).resize((760,240)).save('chk_b.png')
c=Image.new('RGB',(1200,700),(255,255,255));c.paste(Image.open('chk_a.png'),(0,0));c.paste(Image.open('chk_b.png'),(440,0));c.save('chk_scale.png')
