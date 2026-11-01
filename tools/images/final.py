import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ni
PUB='D:/Shared Folder/Work Data/Website/everest_Site/public/'
def alpha_save(im,fg,name,maxw=1200):
    al=Image.fromarray((fg*255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    o=im.convert('RGBA');o.putalpha(al);o=o.crop(o.getbbox());o.thumbnail((maxw,maxw),Image.LANCZOS)
    o.save(f'web/{name}.webp',quality=86,method=6);print(name,o.size)
def edge_mode(p,name,lo=232):
    im=Image.open(p).convert('RGB');a=np.asarray(im).astype(int)
    cand=(a.min(2)>=lo)&((a.max(2)-a.min(2))<14)
    lab,n=ni.label(cand);e=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0}
    fg=~np.isin(lab,list(e));fg=ni.binary_opening(fg,iterations=1)
    l2,n2=ni.label(fg);s=ni.sum(fg,l2,range(1,n2+1));fg=np.isin(l2,[i+1 for i,v in enumerate(s) if v>0.004*fg.size])
    alpha_save(im,ni.binary_fill_holes(fg),name)
def any_mode(p,name,lo=190):
    # no white parts in these products, so every pale neutral region is background or shadow
    im=Image.open(p).convert('RGB');a=np.asarray(im).astype(int)
    bg=(a.min(2)>=lo)&((a.max(2)-a.min(2))<16)
    fg=ni.binary_opening(~bg,iterations=1)
    l2,n2=ni.label(fg);s=ni.sum(fg,l2,range(1,n2+1));fg=np.isin(l2,[i+1 for i,v in enumerate(s) if v>0.0015*fg.size])
    alpha_save(im,fg,name)
edge_mode('raw/1776490119946_GA550_8L.png.png','compressor-8l')
edge_mode('raw/1776501672174_2HP_50L_Silent_Air_Compressor_.png.png','compressor-2hp')
edge_mode(PUB+'Dental_Lab_Oil_free_Air_Compressor.png','dental')
edge_mode(PUB+'Screw_Air_Compressor.png','screw')
any_mode('raw/1776515132847_Hand_Pallet_Jack.png.png','pallet-side')
any_mode('raw/1776515504868_Heavy_Duty_Pallet_Truck.png.png','pallet-front')
im=Image.open('raw/1775557094343_GA750_Kit.webp.webp').convert('RGB');a=np.asarray(im).astype(int)
any_mode('raw/1775557094343_GA750_Kit.webp.webp','motor-kit',lo=236)
w=Image.open(PUB+'Hydraulic_Hand_Pallet_Truck.png').convert('RGB');w.thumbnail((1400,1400));w.save('web/warehouse.webp',quality=82,method=6)
# logo: red ink to alpha
l=Image.open(PUB+'Top_Logo.jpeg').convert('RGB');a=np.asarray(l).astype(float)
al=np.clip((255-a[...,1])/(255-12),0,1)
al[al<0.06]=0
H,W=al.shape
def logo(rgb_mark,rgb_word,name):
    o=np.zeros((H,W,4),'uint8');o[...,3]=(al*255).astype('uint8')
    o[...,:3]=rgb_mark;o[:,470:,:3]=rgb_word
    i=Image.fromarray(o,'RGBA');i=i.crop(i.getbbox());i.save(f'web/{name}.png',optimize=True);print(name,i.size)
logo((214,16,16),(214,16,16),'logo-red')
logo((226,32,32),(245,245,243),'logo-on-dark')
