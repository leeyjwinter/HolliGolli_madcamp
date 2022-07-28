# cs496_4ndWeek
> 2022 여름 MadCamp 2분반 정채현, 이영준 팀
## 프로젝트 이름
```
HolliGolli
```
## 팀원
* 숙명여대 컴퓨터과학과 [정채현](https://github.com/chaehyuns)
* 성균관대 컴퓨터교육과 [이영준](https://github.com/leeyjwinter)

## 개발 환경
* OS: Window, ios
* Language: python(RenPy), HTML, CSS, Javascript
* IDE: Visual Studio Code, CodeSandbox

## 프로젝트 소개!

### Renpy 게임엔진에서 할리갈리 페이지로 넘어가 게임을 플레이 할 수 있다.

![](https://velog.velcdn.com/images/leeyjwinter/post/dd1e0d8b-0e60-459a-b4c2-6b94eca1aeb0/image.png)

* 시작화면에서 사용자의 초기 점수와 마룻바닥 texture을 가진 floor위에 종 모양 3d object가 있다.
* 화면 아무곳을 클릭하면 대각선의 4방향에서 순차적으로 과일을 상징하는 주사위가 1~5 사이의 숫자로 굴려져 온다. 
 
![](https://velog.velcdn.com/images/leeyjwinter/post/94799cdc-215f-4b39-83db-bdaf7f3acaf0/image.png)

### 종 누르기 

![](https://velog.velcdn.com/images/leeyjwinter/post/313238af-101c-402d-ba19-d1e51a282f95/image.png)

* 사용자는 어느 순간에나 종을 누를 수 있으나, 한가지의 과일이라도 5가 아니라면 점수가 10점 차감된다.
* 또한 1.5초의 시간 안에 안누를 시 종 소리가 들리면서 웹이 refresh되어 점수를 가져갈 수 없다.


![](https://velog.velcdn.com/images/leeyjwinter/post/83c3d5b0-c654-4fae-8fd4-da11e2d27440/image.png)

* 1.5초의 시간 전에 종을 누르면 win!! textgeometry가 불러와지며 점수가 50점 증가한다. 
