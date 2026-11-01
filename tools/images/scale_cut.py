import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ni
im=Image.open('scale_retouched.png').convert('RGB')
im.crop((1288,186,2432,1240)).resize((760,700),Image.LANCZOS).save('web/scale-display.webp',quality=86,method=6)
a=np.asarray(im).astype(int).copy()
a[150:1270,1270:2470]=255   # blank the inset panel before cutting out the truck
cand=(a.min(2)>=232)&((a.max(2)-a.min(2))<14)
lab,n=ni.label(cand);e=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0}
fg=~np.isin(lab,list(e));fg=ni.binary_opening(fg,iterations=2)
l2,n2=ni.label(fg);s=ni.sum(fg,l2,range(1,n2+1));fg=np.isin(l2,[i+1 for i,v in enumerate(s) if v>0.004*fg.size])
H,W=cand.shape
for i,sl in enumerate(ni.find_objects(lab)):
    if i+1 in e: continue
    if (lab[sl]==i+1).sum()>600: fg[lab==i+1]=False
al=Image.fromarray((fg*255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
o=Image.fromarray(a.astype('uint8')).convert('RGBA');o.putalpha(al);o=o.crop(o.getbbox());o.thumbnail((1200,1200),Image.LANCZOS)
o.save('web/scale-truck.webp',quality=86,method=6);print(o.size)
t=Image.new('RGB',(1500,560),(240,241,243));p=o.copy();p.thumbnail((640,540));t.paste(p,(10,10),p)
d=Image.open('web/scale-display.webp');d.thumbnail((560,540));t.paste(d,(680,10));t.save('chk_scale2.png')
