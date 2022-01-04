import  * as commander  from "commander"
import { translate } from "./main";
const program = new commander.Command()
program.version('0.0.2')
  .name('tsl')
  .usage('<English>') // <>代表必选
  .arguments('<English>')
  .action(function(english) {
    translate(english)
  })

program.parse(process.argv)