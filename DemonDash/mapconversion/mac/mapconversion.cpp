//mapconversion.cpp

#include <iostream>
#include <stdlib.h>

#include <string>
#include <fstream>
#include <streambuf>
#include <regex>

using namespace std;

string replaceStartOfLines(string in_)
{
	string outData = "['" + in_;
	const char * replace = "\n['";
	size_t sPos = 0;

	while (sPos != string::npos) 
	{
		sPos = outData.find('\n', sPos);

		if (sPos != string::npos)
		{
			outData = outData.replace(sPos, 1, replace);
			sPos+=3;
		}
	}



	return outData;
}

string replaceEndOfLines(string in_)
{
	const char * replace = "'],\n";
	size_t sPos = 0;

	while (sPos != string::npos) 
	{
		sPos = in_.find('\n', sPos);
		cout << sPos << endl;

		if (sPos != string::npos)
		{
			in_ = in_.replace(sPos, 1, replace);
			sPos+=4;
		}
	}
	return in_;
}

string addApos(string in_)
{
	const char * replace = "','";
	size_t sPos = 0;

	while (sPos != string::npos) 
	{
		sPos = in_.find(',', sPos);

		if (sPos != string::npos)
		{
			in_ = in_.replace(sPos, 1, replace);
			sPos+=3;
		}
	}
	return in_;
}

string replaceDots(string in_)
{
	const char * replace = ".";
	size_t sPos = 0;

	while (sPos != string::npos) 
	{
		sPos = in_.find("-1", sPos);

		if (sPos != string::npos)
		{
			in_ = in_.replace(sPos, 2, replace);
			sPos+=1;
		}
	}
	return in_;
}

string replaceDownSpikes(string in_)
{
	const char * replace = "v";
	size_t sPos = 0;

	while (sPos != string::npos) 
	{
		sPos = in_.find("10", sPos);

		if (sPos != string::npos)
		{
			in_ = in_.replace(sPos, 2, replace);
			sPos+=1;
		}
	}
	return in_;
}

string replaceUpSpikes(string in_)
{
	const char * replace = "^";
	size_t sPos = 0;

	while (sPos != string::npos) 
	{
		sPos = in_.find("13", sPos);

		if (sPos != string::npos)
		{
			in_ = in_.replace(sPos, 2, replace);
			sPos+=1;
		}
	}
	return in_;
}

string replaceLeftSpikes(string in_)
{
	const char * replace = "<";
	size_t sPos = 0;

	while (sPos != string::npos) 
	{
		sPos = in_.find("11", sPos);

		if (sPos != string::npos)
		{
			in_ = in_.replace(sPos, 2, replace);
			sPos+=1;
		}
	}
	return in_;
}

string replaceRightSpikes(string in_)
{
	const char * replace = ">";
	size_t sPos = 0;

	while (sPos != string::npos) 
	{
		sPos = in_.find("12", sPos);

		if (sPos != string::npos)
		{
			in_ = in_.replace(sPos, 2, replace);
			sPos+=1;
		}
	}
	return in_;
}

string replaceEnemies(string in_)
{
	const char * replace = "e";
	size_t sPos = 0;

	while (sPos != string::npos) 
	{
		sPos = in_.find("14", sPos);

		if (sPos != string::npos)
		{
			in_ = in_.replace(sPos, 2, replace);
			sPos+=1;
		}
	}
	return in_;
}

string replacePlayer(string in_)
{
	const char * replace = "p";
	size_t sPos = 0;

	while (sPos != string::npos)
	{
		sPos = in_.find("15", sPos);

		if (sPos != string::npos)
		{
			in_ = in_.replace(sPos, 2, replace);
			sPos += 1;
		}
	}
	return in_;
}

string replaceGoal(string in_)
{
	const char * replace = "g";
	size_t sPos = 0;

	while (sPos != string::npos)
	{
		sPos = in_.find("16", sPos);

		if (sPos != string::npos)
		{
			in_ = in_.replace(sPos, 2, replace);
			sPos += 1;
		}
	}
	return in_;
}


int main(int argc,  char** argv)
{
	int x = 0;
	std::cout << "Demon Dash Map Conversion Utility" << std::endl;

	//if we got the correct num of args, do the conversion
	if (argc == 2)
	{
		//read the csv file into the program
		std::ifstream mapFile(argv[1]);
		std::string inData((std::istreambuf_iterator<char>(mapFile)), std::istreambuf_iterator<char>());

		//failure
		if(!mapFile) 
		{
        	cout << "Couldn't open file " << argv[1] << " - did you spell it correctly? Aborting ddmc" << endl;
        	return -1;
    	}

		//success? output string
		cout << "original file: " << endl << inData << endl << endl;

		string out = replaceStartOfLines(inData);
		out = addApos(out);
		out = replaceEndOfLines(out);		
		out = replaceDots(out);
		out = replaceUpSpikes(out);
		out = replaceDownSpikes(out);
		out = replaceLeftSpikes(out);
		out = replaceRightSpikes(out);
		out = replaceEnemies(out);
		out = replacePlayer(out);
		out = replaceGoal(out);

		//replace \n['
		size_t sPos = out.find_last_of("\n");
		out = out.replace(sPos, 3, "");

		//add \n ], \n\n partime: 5000 \n } );
		out = "levels.push({ \n platforms : [\n" + out;
		out += "\n ], \n\n parTime: 5000 \n } );";

		//write the out to file
		std::ofstream outFile(string(argv[1]) + string(".js"));
		outFile << out;

		cout << "result: " << endl << out << endl;
	}
	else
	{
		std::cout << "usage: ddmc mapname.csv" << endl;
	}

	return 0;
}