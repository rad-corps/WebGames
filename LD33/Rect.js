function Rect(centre_, w_, h_)
{
	var self = this;
	self.width = w_;
	self.height = h_; 
	self.center = centre_;
	
	this.scale = function(scale_)
	{
		self.width *= scale_;
		self.height *= scale_;
	}

	this.left = function()
	{
		return self.centre._x - (self.width / 2);
	}

	this.right = function()
	{
		return self.centre._x + (self.width / 2);
	}

	this.bottom = function()
	{
		return self.centre._y + (self.height / 2);
	}

	this.top = function()
	{
		return self.centre._y - (self.height / 2);
	}

	this.centre = function()
	{
		return self.centre;
	}

	this.setY = function(y_)
	{
		self.centre._y = y_;
	}
	
	this.setX = function(x_)
	{
		self.centre._x = x_;
	}

	this.toString = function()
	{
		console.log("Left: " + self.left());
		console.log("Right: " + self.right());
		console.log("Top: " + self.top());
		console.log("Bottom: " + self.bottom());		

		return out.str();
	}

	
};