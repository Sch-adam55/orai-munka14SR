import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Sutemeny } from './sutemeny';
import { CreateSutemenyDto, UpdateutemenyDto } from './create-sutemeny.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  sutik: Sutemeny[]=[
    {
      id:1,
      nev: 'Tiramisu',
      laktozMentes: true,
      db: 5,
    },
    {
      id:2,
      nev: 'Dobostorta',
      laktozMentes: true,
      db: 0,
    },
    {
      id:4,
      nev: 'Krémes',
      laktozMentes: true,
      db: 1,
    },
  ]
  nextID=5;
  @Get('sutik')
  sutemyenyekListazas(){
    return this.sutik;
  }

  @Get('sutik/:sutiid')
  sutemenyIdAlapjan(@Param('sutiid') id: string){
    const idSzam=parseInt(id);
    const suti=this.sutik.find(suti=> suti.id == idSzam);
    if(!suti){
      throw new NotFoundException('Nincs ilyen ID-jü süti')
    }
    return suti;
  }

  @Delete('sutik/:sutiid')
  sutiTorles(@Param(':sutiid') id:string){
    const idSzam =parseInt(id);
    const idx = this.sutik.findIndex(suti => suti.id == idSzam);
    this.sutik.splice(idx);

    //this.sutik=this.sutik.filter(suti=> suti.id !=idSzam);
  }

  @Get('sutiKereses')
  sutemenyKereses(@Query('Kereses') kereses?: string){
    if (!kereses){
      return this.sutik;
    }
    return this.sutik.filter(suti=> suti.nev.toLocaleLowerCase().includes(kereses.toLocaleLowerCase()));
  }

  @Post('ujsutik')
  ujsuti(@Body()ujsutiAdatok: CreateSutemenyDto){
    const ujSutemeny:Sutemeny={
      ...ujsutiAdatok,
      id: this.nextID,
    }
    this.nextID++;
    this.sutik.push(ujSutemeny);
    return ujSutemeny;
  }

  @Patch('sutiModositas/:sutiid')
  sutiModositas(@Param('sutiid') id:string, @Body() sutiAdatok:UpdateutemenyDto){
    const idSzam=parseInt(id);
    const eredetisutiID= this.sutik.findIndex(suti=> suti.id == idSzam);
    const eredetiSuti=this.sutik[eredetisutiID];

    if (typeof sutiAdatok.db != 'number'){
      throw new BadRequestException('A db típusa number kell legyne');
    }
    if(sutiAdatok.db <0){
      throw new BadRequestException('A db ')
    }

    const ujsuti: Sutemeny={
      ...eredetiSuti,
      ...sutiAdatok,

    };
    this.sutik[eredetisutiID]=ujsuti;
    return ujsuti;
  }
}


