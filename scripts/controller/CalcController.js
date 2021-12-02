class CalcController {

    constructor() {

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    initialize() {

        setInterval(() => {

            this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
            this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
        }, 1000);

        this.setLastNumberToDisplay();

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio();
            })
        })

    }

    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;

        /*
        if (this._audioOnOff) {
            this._audioOnOff = false;
        } else {
            this._audioOnOff = true;
        }*/
    }

    playAudio() {
        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    //evento usado abaixo
    addEventListenerAll(element, events, fn) { //1°, 2° e 3° parametros do evento criado por nos, para usarmos pouco mais a baixo

        events.split(' ').forEach(event => { //split percorre uma string e procura, nesse caso (' '), um espaço vazio, para separar e transformar em arrey[]
            element.addEventListener(event, fn, false); // aqui como fica o evento dps da escolha de qual dos eventos acontece
        })
    }

    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    };

    clearEntry() {
        this._operation.pop(); //pop elimina o ultimo item do array
        this.setLastNumberToDisplay();
    };

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    };

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {

        return (['+', '-', '*', '/', '%'].indexOf(value) > -1); //indexOf = é desse tipo?

    }

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();
        }

    }

    getResult() {
        try { //try catch para exibir algo caso aconteca erro nesse codigo
            return eval(this._operation.join(""));
        } catch (e) {
            this.setError();
        }
    }

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem(true);

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];

            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {
            console.log('passou 1');
            last = this._operation.pop();
            this._lastNumber = this.getResult(); //fazendo isso para guardar o resultado quando clicar no botao igual

        } else if (this._operation.length == 3) { //else if para pular esse caso caia no primeiro if
            console.log('passou 2');
            this._lastNumber = this.getLastItem(false); //fazendo isso para guardar o resultado quando clicar no botao igual
        }

        console.log('_lastOperator', this._lastOperator);
        console.log('_lastNumber', this._lastNumber);

        let result = this.getResult();
        if (result.toString().split('.').length > 1) {
            result = result.toFixed(2);
        }
        //join para juntar os array em 1 //eval para fazer a operaçao

        if (last == '%') {

            let porcento = this._operation[0] * this._operation[2] / 100;

            this._operation[this._operation.length - 1] = porcento;

        } else {

            this._operation = [result];
            if (last) this._operation.push(last);
        }
        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true) {
        //aqui os parametros sao true ou false, true tras o ultimo operador e false tras o ultimo numero

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }


        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);

        if (lastNumber.toString().length > 10) lastNumber = lastNumber.toString().substr(0, 10);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }
    addOperation(value) {

        if (isNaN(this.getLastOperation())) { //isNaN verifica se é numero, NAO É NUMERO? TRUE(verdade)
            //string-ultimo item do array

            if (this.isOperator(value)) {

                //se for outro operador, troca o operador
                this.setLastOperation(value);

            } else {
                //o cara digitado atual é numero
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else if (this.isOperator(value)) {
            this.pushOperation(value);

        } else {
            //number-ultimo item do array
            //ja q o ultimo é numero, faremos o atual cocatenar com o atual digitado
            let newValue = this.getLastOperation().toString() + value.toString();

            this.setLastOperation(newValue); //muda o valor do ultimo array

            this.setLastNumberToDisplay();

        }




    };

    setError() {
        this.displayCalc = "Error"; //exibir mensagem de erro no display
    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return; //verifica se é uma string e se tem ponto

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }

    execBtn(value) {

        this.playAudio();

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value)); //colocanddo o value, vai ser add o valor digitado

                break;

            default:
                this.setError();
                break;
        }
    }

    initKeyboard() {

        document.addEventListener('keyup', e => {

            this.playAudio();

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                case '=':
                case 'Enter':
                    this.calc();
                    break;

                case ',':
                case '.':
                    this.addDot('.');
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key)); //colocanddo o value, vai ser add o valor digitado

                    break;
            }
        })
    }


    //click de botoes
    initButtonsEvents() {

        let buttons = document.querySelectorAll('#buttons > g, #parts > g'); //todos os botoes

        buttons.forEach((btn, index) => { // btn aqui do parametro é para percorrer oque tiver btn, no caso uma classe dos buttons

            //tivemos que criar uma funçao addEventListenerAll para poder percorrer mais de um evento, no caso(click e drag) criando um outro forEach
            this.addEventListenerAll(btn, "click drag", e => { // "e" é para chamar o cara q foi clicado, o botao especifico
                let textBtn = btn.className.baseVal.replace("btn-", ""); //replace vai fazer a troca de palavras 'btn-' por ' '. deixando so oque vem dps

                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";
            })
        })
    }



    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        return this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        return this._dateEl.innerHTML = value;
    }

    get displayCalc() {

        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {

        if (value.toString().length > 10) {
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }




}