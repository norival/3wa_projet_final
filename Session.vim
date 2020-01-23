let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/work/norival/norival.dev
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +16 src/Controller/HomeController.php
badd +1 templates/home/index.html.twig
badd +6 templates/base.html.twig
badd +77 webpack.config.js
badd +1 assets/js/app.js
badd +11 assets/js/home.js
badd +3 assets/js/greet.js
badd +30 assets/css/app.scss
badd +17 src/Controller/CvController.php
badd +3 config/packages/assets.yaml
badd +29 assets/css/home.scss
badd +1 assets/css/_nav.scss
badd +2 assets/css/fonts.css
argglobal
%argdel
$argadd src/Controller/HomeController.php
set stal=2
edit templates/home/index.html.twig
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 119 + 119) / 239)
exe 'vert 2resize ' . ((&columns * 119 + 119) / 239)
argglobal
setlocal fdm=syntax
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=1
setlocal fen
let s:l = 113 - ((46 * winheight(0) + 33) / 67)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
113
normal! 024|
wincmd w
argglobal
if bufexists("assets/css/home.scss") | buffer assets/css/home.scss | else | edit assets/css/home.scss | endif
setlocal fdm=syntax
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=1
setlocal fml=1
setlocal fdn=1
setlocal fen
let s:l = 120 - ((34 * winheight(0) + 33) / 67)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
120
normal! 021|
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 119 + 119) / 239)
exe 'vert 2resize ' . ((&columns * 119 + 119) / 239)
tabedit assets/js/app.js
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 119 + 119) / 239)
exe 'vert 2resize ' . ((&columns * 119 + 119) / 239)
argglobal
setlocal fdm=syntax
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=1
setlocal fen
let s:l = 12 - ((11 * winheight(0) + 33) / 67)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
12
normal! 0
wincmd w
argglobal
if bufexists("assets/css/app.scss") | buffer assets/css/app.scss | else | edit assets/css/app.scss | endif
setlocal fdm=syntax
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=1
setlocal fen
let s:l = 21 - ((20 * winheight(0) + 33) / 67)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
21
normal! 0
wincmd w
exe 'vert 1resize ' . ((&columns * 119 + 119) / 239)
exe 'vert 2resize ' . ((&columns * 119 + 119) / 239)
tabnext 1
set stal=1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOF
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
